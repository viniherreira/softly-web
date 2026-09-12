'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * "Sinal" — o momento de escala da página, controlado pelo scroll.
 *
 * Uma mão puxa um fio luminoso da esquerda para a direita conforme você rola,
 * e a frase é descoberta no mesmo sentido, como se o fio a estivesse trazendo
 * para fora do escuro. O gesto e o texto são a mesma ação: por isso o recorte
 * da frase está amarrado ao avanço da sequência, e não a um tempo próprio.
 *
 * POR QUE NÃO COBRE A TELA INTEIRA
 * O vídeo é 16:9 (1280×720) e a mão vive na borda ESQUERDA. Um `cover` na
 * viewport recortaria as laterais e comeria justamente o sujeito. No desktop
 * ele ocupa 100% da largura e a altura sai da proporção: a faixa preta que
 * sobra acima e abaixo é o mesmo preto do vídeo, então a emenda não aparece —
 * e é ali que a frase cabe sem disputar com o fio.
 * No celular a regra inverte (ver o comentário no JSX).
 *
 * ORIGEM E QUALIDADE DOS QUADROS
 * /public/fio vem do MP4 do cliente já reprocessado para 2560×1440, fatiado
 * em 48 quadros e reduzido para 1920×1080. Quatro decisões, todas medidas —
 * a métrica é o perfil vertical do fio de luz num canvas de 2860px (o caso
 * de um desktop retina): pico de brilho alto e faixa estreita a meia altura
 * significam linha nítida.
 *
 * 1. 48 QUADROS BASTAM. O movimento entre vizinhos é de 2,26/255 em média
 *    (máximo 3,92), sem nenhum salto. Dobrar a contagem não compraria
 *    suavidade, só peso.
 *
 * 2. WEBP EM q90. Em q80 o erro máximo contra o PNG sem perda era de 21
 *    níveis — visível como faixa nos degradês escuros, que é quase toda a
 *    cena. Em q90 cai para 11.
 *
 * 3. A FONTE HD VALEU. Contra a versão anterior (1280 ampliado com Lanczos e
 *    nitidez), o mesmo quadro passou de pico 188 / faixa 15,3px para pico
 *    209 / faixa 13,3px. É detalhe real: reduzindo os dois lados a 1280 o
 *    erro médio entre eles é de 1,71 níveis, com picos de 170 — o
 *    reprocessamento reescreveu a imagem, não só interpolou.
 *
 * 4. 1920, NÃO 2560. No tamanho de exibição os dois empatam (pico 213 contra
 *    214,7; faixa 14,0 contra 14,3) e 2560 custaria 2,07 MB contra 1,10 MB.
 *    Se algum dia a régua for um monitor 5K, aí vale subir.
 *
 * 5. O PRETO DO VÍDEO FOI IGUALADO AO DA PÁGINA. A fonte tem piso 0,0,0 e o
 *    site usa #0E0E11 — 94,8% dos pixels ficavam MAIS ESCUROS que o fundo, e
 *    o quadro lia como um retângulo preto colado numa página cinza-escuro.
 *    Corrigido na fonte com `linear(a, b)` por canal (b = 14,14,17 e a
 *    calculado para o branco continuar em 255), não com degradê na borda:
 *    degradê esconderia a emenda mas o corpo do vídeo seguiria mais escuro.
 *    Depois: 0% de pixels abaixo do fundo, realces intactos (máx. 255 no
 *    azul). Se a fonte for reextraída, REFAZER este passo.
 *
 * 6. A MARCA DO UPSCALER SAIU. O arquivo reprocessado vinha com um logotipo
 *    "Wink" queimado em x 39–183, y 28–79, estático nos 48 quadros. Publicar
 *    a marca da ferramenta no site de uma empresa de software é anunciar o
 *    fornecedor errado — o mesmo motivo do corte de "Pippit AI" na primeira
 *    versão. Aqui não precisou recortar: o entorno num raio de 14px tem
 *    luminância ZERO, então um retângulo preto por cima é indistinguível do
 *    fundo. Conferido depois: 0 de luminância máxima em todo o canto.
 *
 * O `sharpen` que existia aqui SAIU: ele compensava a falta de detalhe do
 * 1280. Com a fonte HD ele só devolvia halo — afiar o que já está nítido
 * alarga a linha em vez de estreitá-la.
 *
 * A redução 2560→1920 é feita pelo navegador na extração, não pelo sharp:
 * medi os dois e empatam (pico 209,9 contra 213, mesma faixa), e assim a
 * extração dispensa 53 MB de PNG intermediário.
 *
 * POR QUE QUADROS E NÃO O <video>
 * Rolagem controlando `video.currentTime` engasga — o navegador procura o
 * quadro-chave mais próximo e decodifica até ele, e no Firefox e no Safari
 * isso trava visivelmente. Aqui cada posição de scroll é um `drawImage` de
 * imagem já decodificada.
 */

const FRAMES = 48;
const frameSrc = (index: number) => `/fio/${String(index).padStart(3, '0')}.webp`;

/** Dimensão dos quadros entregues (ver a nota sobre qualidade acima). */
const FRAME = { width: 1920, height: 1080 };

/**
 * Janela em que a frase é descoberta, em fração do avanço da sequência.
 * Casada com o vídeo: o fio começa a esticar por volta de 25% e chega na
 * borda direita por volta de 70%. Fora dessa janela a frase não se move.
 */
const REVELA = { inicio: 0.25, fim: 0.7 };

export function Signal() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  /** Último quadro efetivamente desenhado — evita redesenhar o mesmo. */
  const drawnRef = useRef(-1);
  const textRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  /**
   * Desenha o quadro preenchendo o canvas. Se o quadro pedido ainda não
   * carregou, procura para trás o mais recente que já está pronto — assim a
   * cena segura o quadro anterior em vez de piscar em preto.
   */
  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let usable = -1;
    for (let i = index; i >= 0; i -= 1) {
      if (imagesRef.current[i]?.complete) {
        usable = i;
        break;
      }
    }
    if (usable < 0 || usable === drawnRef.current) return;

    const context = canvas.getContext('2d');
    const image = imagesRef.current[usable];
    if (!context || !image) return;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    drawnRef.current = usable;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    /* Teto de 2: acima disso a fonte (1280px) não tem detalhe para entregar
       e só custaria memória de textura. */
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const last = drawnRef.current;
    drawnRef.current = -1;
    draw(last < 0 ? 0 : last);
  }, [draw]);

  useEffect(() => {
    imagesRef.current = Array.from({ length: FRAMES }, (_, index) => {
      const image = new Image();
      /* O primeiro quadro é o que aparece antes de qualquer rolagem; o resto
         chega em segundo plano. */
      image.fetchPriority = index === 0 ? 'high' : 'low';
      image.decoding = 'async';
      image.src = frameSrc(index);
      if (index === 0) image.onload = () => draw(0);
      return image;
    });

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw, resize]);

  /* Com menos movimento a sequência não roda: fica o quadro do fio já
     esticado, com a frase inteira visível. */
  useEffect(() => {
    if (!reduced) return;
    const index = FRAMES - 1;
    const image = imagesRef.current[index];
    if (!image) return;
    const show = () => draw(index);
    if (image.complete) show();
    else image.onload = show;
  }, [reduced, draw]);

  useMotionValueEvent(scrollYProgress, 'change', (raw) => {
    if (reduced) return;
    /* A sequência termina antes do fim do trecho rolável: o resto existe para
       a frase ficar legível parada, sem obrigar a leitura em movimento. */
    const progress = Math.min(1, Math.max(0, raw) / 0.82);

    draw(Math.min(FRAMES - 1, Math.floor(progress * FRAMES)));

    /* A frase é descoberta da esquerda para a direita, no mesmo sentido e no
       mesmo instante em que o fio é puxado. */
    const r = Math.min(
      1,
      Math.max(0, (progress - REVELA.inicio) / (REVELA.fim - REVELA.inicio)),
    );
    if (textRef.current) {
      textRef.current.style.clipPath = `inset(0 ${((1 - r) * 100).toFixed(1)}% 0 0)`;
    }
  });

  return (
    <section
      ref={ref}
      aria-labelledby="sinal-titulo"
      className={reduced ? 'relative' : 'relative h-[200vh] md:h-[260vh]'}
    >
      <div
        className={
          reduced
            ? 'section-y relative overflow-hidden'
            : 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden'
        }
      >
        {/* Desktop: largura cheia, altura pela proporção — o que sobra acima e
            abaixo é preto, o mesmo preto do vídeo, então a emenda não aparece.

            Celular: 16:9 em 390px de largura dá 219px de altura, e nessa faixa
            o texto não caberia POR CIMA do vídeo — caía abaixo dele. Aí a
            altura manda e a largura transborda, ancorada à ESQUERDA: o que sai
            da tela é a ponta direita do fio, que já continua fora do quadro de
            qualquer jeito. A mão, que é o sujeito, fica. */}
        <div className="relative w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="h-[44svh] w-auto max-w-none md:h-auto md:w-full"
            style={{ aspectRatio: `${FRAME.width} / ${FRAME.height}` }}
          />

          {/* A frase mora DENTRO do wrapper do vídeo, não da seção: assim ela
              fica sobre o quadro em qualquer viewport. Ancorada na altura da
              seção, no celular ela caía abaixo do vídeo, porque lá o quadro é
              baixo e centrado. Aqui o quadro é preto de ponta a ponta na
              faixa de baixo, então o texto não precisa de escurecimento. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[8%] md:bottom-[14%]">
            <div className="shell">
              <h2
                id="sinal-titulo"
                ref={textRef}
                style={{ clipPath: reduced ? 'none' : 'inset(0 100% 0 0)' }}
                className="max-w-3xl text-display-md text-white md:text-display-lg"
              >
                Antes da primeira linha de código, a gente descobre{' '}
                <span className="text-brand-soft">qual número precisa mudar.</span>
              </h2>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
