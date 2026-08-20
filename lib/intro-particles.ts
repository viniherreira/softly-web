/**
 * Engine de partículas da intro cinematográfica.
 *
 * Escrito em Canvas 2D de propósito — nenhuma dependência nova. Para ~1200
 * partículas com brilho, sprites pré-renderizados + composição aditiva rodam a
 * 60fps em hardware modesto; WebGL só pagaria a pena uma ordem de grandeza
 * acima disso.
 *
 * Decisões de performance:
 *  - estado em Float32Array (sem objeto por partícula, sem pressão de GC);
 *  - brilho por sprite + drawImage, nunca shadowBlur (que é ~20× mais caro);
 *  - conexões da rede via grid espacial, não O(n²).
 */

export type Vec2 = { x: number; y: number };

/* ────────────────────────────────────────────────────────────────────────── */
/* Sprites                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Disco com gradiente radial desenhado uma única vez.
 * Cada partícula vira um drawImage escalado — o brilho sai de graça.
 */
export function createGlowSprite(color: string, size = 16): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Amostragem                                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

type SampleRegion = { x: number; y: number; width: number; height: number };

type SampleOptions = {
  /** Distância entre amostras em px. Menor = mais denso e mais caro. */
  step?: number;
  /** Teto de pontos devolvidos (embaralhados antes de cortar). */
  max?: number;
  alphaThreshold?: number;
};

/**
 * Rasteriza um desenho num canvas fora de tela e devolve as coordenadas onde
 * há tinta. É assim que texto e logo viram nuvem de pontos: as partículas
 * herdam a forma real do glifo/traço, não uma aproximação.
 */
export function samplePixels(
  draw: (ctx: CanvasRenderingContext2D) => void,
  region: SampleRegion,
  { step = 3, max = 4000, alphaThreshold = 90 }: SampleOptions = {},
): Vec2[] {
  // Amostra só o retângulo que interessa: um getImageData de tela cheia
  // custava ~1,3M pixels por chamada e travava o primeiro frame.
  const width = Math.max(1, Math.ceil(region.width));
  const height = Math.max(1, Math.ceil(region.height));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return [];

  // Desenha no espaço da tela e desloca para dentro da região.
  ctx.translate(-region.x, -region.y);
  draw(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: Vec2[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = data[(y * width + x) * 4 + 3] ?? 0;
      // devolve em coordenadas de tela
      if (alpha > alphaThreshold) points.push({ x: x + region.x, y: y + region.y });
    }
  }

  // Embaralha antes de cortar para o recorte não enviesar por região.
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = points[i]!;
    const b = points[j]!;
    points[i] = b;
    points[j] = a;
  }

  return points.length > max ? points.slice(0, max) : points;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Grid espacial                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Particiona a tela em células do tamanho do raio de conexão. Cada partícula
 * só compara com as 9 células vizinhas — o custo cai de O(n²) para ~O(n·k).
 * Com 1200 partículas isso é a diferença entre 1,4M e ~15k comparações/frame.
 */
export class SpatialGrid {
  private readonly cells = new Map<number, number[]>();
  private readonly cols: number;

  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly cellSize: number,
  ) {
    this.cols = Math.max(1, Math.ceil(width / cellSize));
  }

  private key(x: number, y: number): number {
    const col = Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.cellSize)));
    const row = Math.max(0, Math.floor(y / this.cellSize));
    return row * this.cols + col;
  }

  clear(): void {
    this.cells.clear();
  }

  insert(index: number, x: number, y: number): void {
    const key = this.key(x, y);
    const bucket = this.cells.get(key);
    if (bucket) bucket.push(index);
    else this.cells.set(key, [index]);
  }

  /** Índices nas 9 células ao redor do ponto. */
  neighbors(x: number, y: number, out: number[]): number[] {
    out.length = 0;
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (c < 0 || c >= this.cols || r < 0) continue;
        const bucket = this.cells.get(r * this.cols + c);
        if (!bucket) continue;
        for (const index of bucket) out.push(index);
      }
    }
    return out;
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Campo de partículas                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

export type IntroPhase = 'idle' | 'dissolve' | 'network' | 'assemble' | 'hold';

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Ruído barato e determinístico — o suficiente para deriva orgânica. */
const noise = (x: number, y: number, t: number): number =>
  Math.sin(x * 0.9 + t * 0.7) * Math.cos(y * 0.8 - t * 0.5);

export class ParticleField {
  readonly count: number;

  /** posição atual */
  readonly px: Float32Array;
  readonly py: Float32Array;
  /** velocidade */
  readonly vx: Float32Array;
  readonly vy: Float32Array;
  /** origem — onde a partícula nasce (o glifo do código) */
  readonly ox: Float32Array;
  readonly oy: Float32Array;
  /** alvo — onde ela precisa chegar (o traço do logo) */
  readonly tx: Float32Array;
  readonly ty: Float32Array;
  /** posição de repouso na nuvem de dados (fase de rede) */
  readonly cx: Float32Array;
  readonly cy: Float32Array;
  /** semente por partícula: escalona atraso, tamanho e deriva */
  readonly seed: Float32Array;
  /** 0 = azul, 1 = ciano, 2 = branco */
  readonly tint: Uint8Array;
  readonly size: Float32Array;

  constructor(count: number) {
    this.count = count;
    this.px = new Float32Array(count);
    this.py = new Float32Array(count);
    this.vx = new Float32Array(count);
    this.vy = new Float32Array(count);
    this.ox = new Float32Array(count);
    this.oy = new Float32Array(count);
    this.tx = new Float32Array(count);
    this.ty = new Float32Array(count);
    this.cx = new Float32Array(count);
    this.cy = new Float32Array(count);
    this.seed = new Float32Array(count);
    this.tint = new Uint8Array(count);
    this.size = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      this.seed[i] = Math.random();
      // Maioria azul, um terço ciano, poucas brancas: as brancas dão o
      // "brilho especular" que impede a nuvem de parecer chapada.
      const roll = Math.random();
      this.tint[i] = roll > 0.88 ? 2 : roll > 0.62 ? 1 : 0;
      this.size[i] = 1.1 + Math.random() * 1.9;
    }
  }

  /** Distribui os pontos de origem (código) ciclando a lista amostrada. */
  setOrigins(points: Vec2[]): void {
    if (!points.length) return;
    for (let i = 0; i < this.count; i++) {
      const point = points[i % points.length]!;
      this.ox[i] = point.x;
      this.oy[i] = point.y;
      this.px[i] = point.x;
      this.py[i] = point.y;
    }
  }

  /**
   * Distribui as posições de repouso da nuvem.
   * Usa o ângulo áureo para espalhar sem aglomerado e raiz quadrada no raio
   * para a densidade ficar uniforme por área (senão tudo empilha no centro).
   */
  setCloud(center: Vec2, radiusX: number, radiusY: number): void {
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < this.count; i++) {
      const angle = i * golden + this.seed[i]! * 0.9;
      const radius = Math.sqrt((i + 0.5) / this.count);
      this.cx[i] = center.x + Math.cos(angle) * radius * radiusX;
      this.cy[i] = center.y + Math.sin(angle) * radius * radiusY;
    }
  }

  /** Distribui os alvos (logo). Sobra de partícula vai para fora do quadro. */
  setTargets(points: Vec2[], fallback: Vec2): void {
    for (let i = 0; i < this.count; i++) {
      const point = points[i % points.length];
      this.tx[i] = point ? point.x : fallback.x;
      this.ty[i] = point ? point.y : fallback.y;
    }
  }

  /**
   * Avança a simulação.
   * `progress` é o andamento (0→1) da fase atual, vindo da timeline do GSAP —
   * assim a física acompanha o easing cinematográfico em vez de correr solta.
   */
  update(
    phase: IntroPhase,
    progress: number,
    dt: number,
    time: number,
    center: Vec2,
  ): void {
    const step = Math.min(dt, 0.05); // aba em segundo plano não pode dar salto

    for (let i = 0; i < this.count; i++) {
      const seed = this.seed[i]!;

      if (phase === 'dissolve') {
        // O caractere se desfaz: cada partícula sai da letra rumo ao seu lugar
        // na nuvem, com atraso escalonado — nem tudo se desmancha junto.
        const local = clamp01((progress - seed * 0.4) / 0.6);
        const ease = 1 - Math.pow(1 - local, 2.4);
        const wobble = Math.sin(local * Math.PI) * (seed - 0.5) * 70;

        this.px[i] = lerp(this.ox[i]!, this.cx[i]!, ease) + wobble * (1 - ease);
        this.py[i] = lerp(this.oy[i]!, this.cy[i]!, ease) - Math.sin(local * Math.PI) * 26 * seed;
        continue;
      }

      if (phase === 'network') {
        // Dados circulando: deriva orgânica sobre a posição de nuvem, que vai
        // encolhendo em direção ao centro conforme a fase avança.
        const shrink = 1 - progress * 0.42;
        const driftX = noise(this.cx[i]! * 0.006, this.cy[i]! * 0.006, time * 0.5) * 16;
        const driftY = noise(this.cy[i]! * 0.006, this.cx[i]! * 0.006, time * 0.42 + 3) * 16;

        const targetX = center.x + (this.cx[i]! - center.x) * shrink + driftX;
        const targetY = center.y + (this.cy[i]! - center.y) * shrink + driftY;

        // Aproximação exponencial: independente de frame rate.
        const k = 1 - Math.exp(-4.5 * step);
        this.px[i] = lerp(this.px[i]!, targetX, k);
        this.py[i] = lerp(this.py[i]!, targetY, k);
        continue;
      }

      if (phase === 'assemble') {
        // Convergência para o traço do logo, em ondas: é o atraso escalonado
        // que faz parecer construção, e não um fade-in disfarçado.
        const local = clamp01((progress - seed * 0.3) / 0.7);
        const ease = 1 - Math.pow(1 - local, 3);
        const arc = Math.sin(ease * Math.PI) * (seed - 0.5) * 46;

        this.px[i] = lerp(this.px[i]!, this.tx[i]! + arc * (1 - ease), 1 - Math.exp(-9 * step * ease));
        this.py[i] = lerp(this.py[i]!, this.ty[i]!, 1 - Math.exp(-9 * step * ease));

        if (local >= 1) {
          this.px[i] = this.tx[i]!;
          this.py[i] = this.ty[i]!;
        }
        continue;
      }

      if (phase === 'hold') {
        // Respiração mínima: o logo fica vivo sem tremer.
        this.px[i] = this.tx[i]! + Math.sin(time * 2.1 + seed * 12) * (0.3 + seed * 0.4);
        this.py[i] = this.ty[i]! + Math.cos(time * 1.8 + seed * 9) * 0.35;
      }
    }
  }
}
