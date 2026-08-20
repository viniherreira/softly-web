'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { useSmoothScroll } from '@/components/motion/smooth-scroll';
import { LogoMark } from '@/components/icons/logo';
import {
  ParticleField,
  SpatialGrid,
  createGlowSprite,
  samplePixels,
  type IntroPhase,
  type Vec2,
} from '@/lib/intro-particles';

const SESSION_KEY = 'softly:preloaded';

/* ══════════════════════════════════════════════════════════════════════════
   FONTE DO LOGO — ponto único de troca
   ══════════════════════════════════════════════════════════════════════════
   As partículas formam o que estiver definido aqui.

   Hoje: o traço do "S" de components/icons/logo.tsx (mesmo path, mesma marca
   que o site usa no header).

   Para usar o SVG oficial, basta trocar por:
     const LOGO_SOURCE: LogoSource = { kind: 'image', src: '/logo-softly.svg' };
   Nada mais no arquivo precisa mudar — a amostragem já trata os dois casos.
   ══════════════════════════════════════════════════════════════════════════ */
type LogoSource =
  | { kind: 'path'; d: string; viewBox: number; strokeWidth: number }
  | { kind: 'image'; src: string };

const LOGO_SOURCE: LogoSource = {
  kind: 'path',
  d: 'M34 13.5C31 10 27.5 8.5 23.5 8.5c-6.5 0-11 3.6-11 9 0 5 3.4 7.6 10.4 9.2l2.6.6c7 1.6 10.4 4.2 10.4 9.2 0 5.4-4.5 9-11 9-4 0-7.5-1.5-10.5-5',
  viewBox: 48,
  strokeWidth: 3.25,
};

/* ── Código exibido na abertura ─────────────────────────────────────────── */
type Token = { t: string; c: 'key' | 'text' | 'punct' | 'accent' };

const CODE_LINES: Token[][] = [
  [
    { t: 'const ', c: 'key' },
    { t: 'idea', c: 'text' },
    { t: ' = ', c: 'punct' },
    { t: 'client', c: 'text' },
    { t: '.', c: 'punct' },
    { t: 'vision', c: 'accent' },
    { t: ';', c: 'punct' },
  ],
  [
    { t: 'const ', c: 'key' },
    { t: 'solution', c: 'text' },
    { t: ' = ', c: 'punct' },
    { t: 'await ', c: 'key' },
    { t: 'build', c: 'accent' },
    { t: '(idea);', c: 'punct' },
  ],
  [
    { t: 'return ', c: 'key' },
    { t: 'solution', c: 'text' },
    { t: ';', c: 'punct' },
  ],
];

const TOTAL_CHARS = CODE_LINES.reduce(
  (sum, line) => sum + line.reduce((s, token) => s + token.t.length, 0),
  0,
);

/** Lê um token de cor do design system e devolve em formato rgb(). */
const readColor = (name: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw ? `rgb(${raw})` : fallback;
};

/**
 * Intro cinematográfica: código → partículas → rede → logo → site.
 *
 * Arquitetura: a timeline do GSAP anima um objeto de estado simples e o loop
 * de render (rAF) apenas lê esse estado e desenha. Isso mantém o easing
 * cinematográfico no GSAP e o desenho barato no canvas, sem um sequer
 * re-render do React durante os 4 segundos.
 *
 * Roda uma vez por sessão, é pulável a qualquer momento e some por completo
 * quando o usuário pede menos movimento.
 */
export function CinematicIntro() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { stop, start } = useSmoothScroll();
  const [active, setActive] = useState(false);
  const [gone, setGone] = useState(false);
  /** Abertura enxuta para quem pediu menos movimento: só opacidade. */
  const [reducedIntro, setReducedIntro] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Trava a decisão em uma única execução: em desenvolvimento o StrictMode
   *  monta o efeito duas vezes, e a segunda passada encontrava a sessão já
   *  marcada pela primeira — a intro nunca chegava a aparecer. */
  const decidedRef = useRef(false);

  /* Decide se a intro roda — antes de qualquer trabalho pesado.
     Lê a preferência direto do matchMedia em vez do hook: durante a
     hidratação o hook ainda devolve o snapshot do servidor (false), e a
     decisão sairia errada justamente para quem pediu menos movimento. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (decidedRef.current) return;
    decidedRef.current = true;

    /* Atalhos de teste, porque a intro roda uma vez por sessão e isso torna
       difícil revê-la durante o desenvolvimento:
         ?intro=1  força a intro, mesmo já vista nesta sessão
         ?intro=0  pula a intro                                            */
    const forced = new URLSearchParams(window.location.search).get('intro');
    if (forced === '0') {
      window.sessionStorage.setItem(SESSION_KEY, '1');
      setGone(true);
      return;
    }

    const seen = Boolean(window.sessionStorage.getItem(SESSION_KEY));
    if (seen && forced !== '1') {
      setGone(true);
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.sessionStorage.setItem(SESSION_KEY, '1');

    if (prefersReduced) {
      // Sem partículas e sem deslocamento: a marca entra e sai só com
      // opacidade, e o scroll nunca é travado.
      setReducedIntro(true);
      const timer = window.setTimeout(() => setReducedIntro(false), 900);
      return () => window.clearTimeout(timer);
    }

    setActive(true);
    return;
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let disposed = false;
    let frame = 0;
    let cleanupTimeline: (() => void) | undefined;

    /* Trava a página durante a intro e devolve o scroll ao sair. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stop();

    const finish = () => {
      if (disposed) return;
      window.sessionStorage.setItem(SESSION_KEY, '1');
      document.body.style.overflow = previousOverflow;
      start();
      setGone(true);
      setActive(false);
    };

    void (async () => {
      /* GSAP começa a baixar já, em paralelo com as fontes: encadear os dois
         awaits custava ~700ms de tela preta antes do primeiro caractere. */
      const gsapPromise = import('gsap');

      /* A amostragem depende da fonte já carregada, senão os pontos saem
         da fonte de fallback e o texto "dissolve" na forma errada. */
      if (document.fonts?.ready) await document.fonts.ready;
      if (disposed) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let width = window.innerWidth;
      let height = window.innerHeight;

      const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();

      const center: Vec2 = { x: width / 2, y: height / 2 };

      /* ── Paleta: lida do design system, sempre na versão escura ───────── */
      const colors = {
        bg: readColor('--ink-900', 'rgb(5 7 15)'),
        blue: readColor('--blue-400', 'rgb(96 165 250)'),
        cyan: readColor('--cyan-400', 'rgb(34 211 238)'),
        glow: readColor('--sky-glow', 'rgb(76 141 255)'),
        text: readColor('--slate-300', 'rgb(195 203 221)'),
        muted: readColor('--slate-500', 'rgb(136 146 172)'),
        white: readColor('--white', 'rgb(245 248 255)'),
      };

      const fontMono =
        getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() ||
        'ui-monospace, monospace';
      const fontDisplay =
        getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() ||
        'Georgia, serif';

      const sprites = [
        createGlowSprite(colors.blue),
        createGlowSprite(colors.cyan),
        createGlowSprite(colors.white),
      ];

      /* ── Layout do bloco de código ────────────────────────────────────── */
      const codeSize = isMobile ? 15 : Math.min(22, Math.max(16, width * 0.0135));
      const lineHeight = codeSize * 1.85;
      const codeFont = `${codeSize}px ${fontMono}`;
      ctx.font = codeFont;

      const lineWidths = CODE_LINES.map((line) =>
        ctx.measureText(line.map((token) => token.t).join('')).width,
      );
      const blockWidth = Math.max(...lineWidths);
      const codeLeft = Math.round(center.x - blockWidth / 2);
      const codeTop = Math.round(center.y - (CODE_LINES.length * lineHeight) / 2 + codeSize * 0.35);

      const tokenColor = (kind: Token['c']): string =>
        kind === 'key' ? colors.blue : kind === 'accent' ? colors.cyan : kind === 'punct' ? colors.muted : colors.text;

      /** Desenha o código até `chars` caracteres. Usado no canvas e na amostragem. */
      const drawCode = (target: CanvasRenderingContext2D, chars: number, alpha: number) => {
        target.font = codeFont;
        target.textBaseline = 'alphabetic';
        target.globalAlpha = alpha;
        let remaining = chars;

        CODE_LINES.forEach((line, lineIndex) => {
          let x = codeLeft;
          const y = codeTop + lineIndex * lineHeight;
          for (const token of line) {
            if (remaining <= 0) return;
            const slice = token.t.slice(0, Math.max(0, Math.floor(remaining)));
            target.fillStyle = tokenColor(token.c);
            target.fillText(slice, x, y);
            x += target.measureText(token.t).width;
            remaining -= token.t.length;
          }
        });
        target.globalAlpha = 1;
      };

      /* ── Pontos de origem: os próprios glifos do código ───────────────── */
      const codeRegion = {
        x: codeLeft - 24,
        y: codeTop - codeSize * 1.4,
        width: blockWidth + 48,
        height: CODE_LINES.length * lineHeight + codeSize,
      };

      const codePoints = samplePixels(
        (offscreen) => {
          offscreen.fillStyle = '#fff';
          offscreen.font = codeFont;
          offscreen.textBaseline = 'alphabetic';
          CODE_LINES.forEach((line, lineIndex) => {
            let x = codeLeft;
            const y = codeTop + lineIndex * lineHeight;
            for (const token of line) {
              offscreen.fillText(token.t, x, y);
              x += offscreen.measureText(token.t).width;
            }
          });
        },
        codeRegion,
        { step: isMobile ? 3 : 2, max: 5000 },
      );

      /* ── Pontos de alvo: o traço do logo ──────────────────────────────── */
      const logoSize = Math.min(isMobile ? 190 : 260, Math.min(width, height) * 0.42);
      const logoLeft = center.x - logoSize / 2;
      const logoTop = center.y - logoSize / 2;

      const drawLogoInto = (target: CanvasRenderingContext2D, image?: HTMLImageElement) => {
        target.save();
        target.strokeStyle = '#fff';
        target.fillStyle = '#fff';
        target.lineCap = 'round';
        target.lineJoin = 'round';

        if (LOGO_SOURCE.kind === 'path') {
          const scale = logoSize / LOGO_SOURCE.viewBox;
          target.translate(logoLeft, logoTop);
          target.scale(scale, scale);
          target.lineWidth = LOGO_SOURCE.strokeWidth;
          target.stroke(new Path2D(LOGO_SOURCE.d));
        } else if (image) {
          const ratio = image.width / image.height || 1;
          const w = ratio >= 1 ? logoSize : logoSize * ratio;
          const h = ratio >= 1 ? logoSize / ratio : logoSize;
          target.drawImage(image, center.x - w / 2, center.y - h / 2, w, h);
        }
        target.restore();
      };

      let logoImage: HTMLImageElement | undefined;
      if (LOGO_SOURCE.kind === 'image') {
        logoImage = await new Promise<HTMLImageElement | undefined>((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(undefined);
          img.src = LOGO_SOURCE.src;
        });
        if (disposed) return;
      }

      const logoPoints = samplePixels(
        (offscreen) => drawLogoInto(offscreen, logoImage),
        { x: logoLeft - 8, y: logoTop - 8, width: logoSize + 16, height: logoSize + 16 },
        { step: 2, max: 3000 },
      );

      /* ── Campo de partículas ──────────────────────────────────────────── */
      const count = isMobile ? 420 : Math.min(1300, Math.floor(width * 0.85));
      const field = new ParticleField(count);
      field.setOrigins(codePoints);
      const shortSide = Math.min(width, height);
      field.setCloud(
        center,
        Math.min(width * 0.4, shortSide * 0.52),
        Math.min(height * 0.34, shortSide * 0.42),
      );

      /* Se a amostragem do logo falhar, a intro ainda termina bem: as
         partículas assentam na nuvem em vez de colapsarem num ponto. */
      if (logoPoints.length) field.setTargets(logoPoints, center);
      else for (let i = 0; i < count; i++) {
        field.tx[i] = field.cx[i]!;
        field.ty[i] = field.cy[i]!;
      }

      const linkRadius = isMobile ? 0 : 74;
      const grid = linkRadius ? new SpatialGrid(width, height, linkRadius) : null;
      const neighborBuffer: number[] = [];

      /* ── Estado animado pela timeline ─────────────────────────────────── */
      const state = {
        phase: 'idle' as IntroPhase,
        progress: 0,
        typed: 0,
        cursorAlpha: 1,
        textAlpha: 1,
        particleAlpha: 0,
        linkAlpha: 0,
        frameAlpha: 0,
        wordAlpha: 0,
        curtain: 0,
        vignette: 1,
      };

      /* ── Render ───────────────────────────────────────────────────────── */
      let lastTime = performance.now();

      const render = (now: number) => {
        if (disposed) return;
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        const time = now / 1000;

        field.update(state.phase, state.progress, dt, time, center);

        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);

        /* halo de fundo — dá profundidade sem custar quase nada */
        if (state.vignette > 0.01) {
          const halo = ctx.createRadialGradient(
            center.x,
            center.y,
            0,
            center.x,
            center.y,
            Math.max(width, height) * 0.55,
          );
          halo.addColorStop(0, `rgba(76,141,255,${0.1 * state.vignette})`);
          halo.addColorStop(1, 'transparent');
          ctx.fillStyle = halo;
          ctx.fillRect(0, 0, width, height);
        }

        /* fase 1 — código nítido + cursor */
        if (state.textAlpha > 0.01) {
          drawCode(ctx, state.typed * TOTAL_CHARS, state.textAlpha);

          if (state.cursorAlpha > 0.01) {
            const typedChars = state.typed * TOTAL_CHARS;
            let consumed = 0;
            let cursorX = codeLeft;
            let cursorLine = 0;
            for (let i = 0; i < CODE_LINES.length; i++) {
              const line = CODE_LINES[i]!;
              const lineChars = line.reduce((s, token) => s + token.t.length, 0);
              if (typedChars <= consumed + lineChars) {
                cursorLine = i;
                ctx.font = codeFont;
                const visible = Math.max(0, typedChars - consumed);
                const text = line.map((token) => token.t).join('').slice(0, Math.floor(visible));
                cursorX = codeLeft + ctx.measureText(text).width;
                break;
              }
              consumed += lineChars;
              cursorLine = i;
              cursorX = codeLeft + lineWidths[i]!;
            }
            const blink = 0.55 + Math.sin(time * 7) * 0.45;
            ctx.globalAlpha = state.cursorAlpha * blink * state.textAlpha;
            ctx.fillStyle = colors.cyan;
            ctx.fillRect(cursorX + 2, codeTop + cursorLine * lineHeight - codeSize * 0.82, 2, codeSize * 1.05);
            ctx.globalAlpha = 1;
          }
        }

        /* rede — linhas entre partículas próximas */
        if (grid && state.linkAlpha > 0.01) {
          grid.clear();
          for (let i = 0; i < count; i++) grid.insert(i, field.px[i]!, field.py[i]!);

          ctx.lineWidth = 0.6;
          ctx.beginPath();
          let drawn = 0;
          for (let i = 0; i < count && drawn < 2200; i += 2) {
            const x = field.px[i]!;
            const y = field.py[i]!;
            const neighbors = grid.neighbors(x, y, neighborBuffer);
            for (const j of neighbors) {
              if (j <= i) continue;
              const dx = field.px[j]! - x;
              const dy = field.py[j]! - y;
              const distSq = dx * dx + dy * dy;
              if (distSq > linkRadius * linkRadius) continue;
              ctx.moveTo(x, y);
              ctx.lineTo(field.px[j]!, field.py[j]!);
              if (++drawn >= 2200) break;
            }
          }
          ctx.strokeStyle = `rgba(96,165,250,${0.16 * state.linkAlpha})`;
          ctx.stroke();
        }

        /* partículas — composição aditiva para o brilho somar */
        if (state.particleAlpha > 0.01) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = state.particleAlpha;
          for (let i = 0; i < count; i++) {
            const sprite = sprites[field.tint[i]!]!;
            const size = field.size[i]! * (state.phase === 'hold' ? 2.9 : 4.2);
            ctx.drawImage(sprite, field.px[i]! - size / 2, field.py[i]! - size / 2, size, size);
          }
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
        }

        /* moldura do logo — remate que se desenha depois das partículas */
        if (state.frameAlpha > 0.01 && LOGO_SOURCE.kind === 'path') {
          const scale = logoSize / LOGO_SOURCE.viewBox;
          ctx.save();
          ctx.translate(logoLeft, logoTop);
          ctx.scale(scale, scale);
          ctx.globalAlpha = state.frameAlpha * 0.5;
          ctx.strokeStyle = colors.glow;
          ctx.lineWidth = 1.5 / scale + 0.4;
          const radius = 13;
          ctx.beginPath();
          ctx.roundRect(1.75, 1.75, 44.5, 44.5, radius);
          ctx.stroke();
          ctx.restore();
          ctx.globalAlpha = 1;
        }

        /* wordmark */
        if (state.wordAlpha > 0.01) {
          ctx.globalAlpha = state.wordAlpha;
          ctx.fillStyle = colors.muted;
          ctx.font = `${isMobile ? 11 : 12}px ${fontMono}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const letters = 'S O F T L Y';
          ctx.fillText(letters, center.x, logoTop + logoSize + (isMobile ? 34 : 44));
          ctx.textAlign = 'left';
          ctx.textBaseline = 'alphabetic';
          ctx.globalAlpha = 1;
        }

        /* cortina de saída */
        if (state.curtain > 0) {
          ctx.globalAlpha = state.curtain;
          ctx.fillStyle = colors.bg;
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 1;
        }

        frame = requestAnimationFrame(render);
      };

      frame = requestAnimationFrame(render);

      /* ── Timeline ─────────────────────────────────────────────────────── */
      const { default: gsap } = await gsapPromise;
      if (disposed) return;

      const enter = (phase: IntroPhase) => {
        state.phase = phase;
        state.progress = 0;
      };

      const tl = gsap.timeline({ onComplete: finish });

      // 0,35 → 1,40  o código é digitado
      tl.to(state, { typed: 1, duration: 1.05, ease: 'none' }, 0.35);

      // 1,40 → 2,10  os caracteres se desfazem em partículas
      tl.call(enter, ['dissolve'], 1.4)
        .fromTo(state, { progress: 0 }, { progress: 1, duration: 0.7, ease: 'power2.out' }, 1.4)
        .to(state, { textAlpha: 0, duration: 0.45, ease: 'power2.in' }, 1.4)
        .to(state, { cursorAlpha: 0, duration: 0.2 }, 1.4)
        .to(state, { particleAlpha: 1, duration: 0.4, ease: 'power2.out' }, 1.42);

      // 2,10 → 2,95  as partículas se conectam em rede e convergem
      tl.call(enter, ['network'], 2.1)
        .fromTo(state, { progress: 0 }, { progress: 1, duration: 0.85, ease: 'sine.inOut' }, 2.1)
        .to(state, { linkAlpha: 1, duration: 0.4, ease: 'power2.out' }, 2.12)
        .to(state, { vignette: 1.6, duration: 0.85, ease: 'sine.inOut' }, 2.1);

      // 2,95 → 3,45  as partículas montam o logo
      tl.call(enter, ['assemble'], 2.95)
        .fromTo(state, { progress: 0 }, { progress: 1, duration: 0.55, ease: 'power2.inOut' }, 2.95)
        .to(state, { linkAlpha: 0, duration: 0.35, ease: 'power2.in' }, 2.95);

      // 3,45 → 3,95  o logo assenta e a cortina revela o site
      tl.call(enter, ['hold'], 3.45)
        .to(state, { frameAlpha: 1, duration: 0.4, ease: 'power2.out' }, 3.45)
        .to(state, { wordAlpha: 1, duration: 0.35, ease: 'power2.out' }, 3.55)
        .to(state, { curtain: 1, duration: 0.4, ease: 'power2.inOut' }, 3.75);

      if (isMobile) tl.timeScale(1.18); // mesma leitura, ~3,4s

      /* Pular: qualquer intenção do usuário acelera a saída. */
      const skip = () => tl.timeScale(tl.timeScale() * 3.2);
      window.addEventListener('pointerdown', skip, { once: true });
      window.addEventListener('keydown', skip, { once: true });
      window.addEventListener('wheel', skip, { once: true, passive: true });
      window.addEventListener('resize', resize);

      cleanupTimeline = () => {
        tl.kill();
        window.removeEventListener('pointerdown', skip);
        window.removeEventListener('keydown', skip);
        window.removeEventListener('wheel', skip);
        window.removeEventListener('resize', resize);
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanupTimeline?.();
      document.body.style.overflow = previousOverflow;
      start();
    };
  }, [active, isMobile, stop, start]);

  if (reducedIntro) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-ink-900 motion-safe:transition-opacity"
        style={{ animation: 'softly-reduced-intro 900ms ease-in-out forwards' }}
      >
        <LogoMark className="h-20 w-20" />
      </div>
    );
  }

  if (gone || !active) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] overflow-hidden bg-ink-900"
      style={{ contain: 'strict' }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
