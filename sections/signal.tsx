'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * "Sinal" — o momento de escala da página, controlado pelo scroll.
 *
 * Uma sequência de quadros avança conforme você rola: a mão desce, encosta, e
 * a luz acende e se espalha para a direita — na direção da frase que ela
 * acende. O gesto casa com o que a frase diz: algo começa a funcionar no
 * instante do toque.
 *
 * ORIGEM DOS QUADROS
 * /public/sequencia vem do MP4 vertical enviado pelo cliente, fatiado em 48
 * quadros. O corte remove os 72px do topo, onde havia uma marca d'água
 * "Pippit AI" — publicar a marca da ferramenta de IA no site de uma empresa
 * de software seria anunciar o fornecedor errado.
 *
 * POR QUE ESTE TAMANHO, E NÃO SANGRIA TOTAL
 * A fonte tem 720px de largura. Na primeira versão eu extraí os quadros a
 * 960px (ampliação que não cria detalhe, só peso) e ainda exibi em tela
 * cheia — num monitor retina isso dava 3x de ampliação, e a imagem ficava
 * lavada. Agora os quadros saem na largura nativa e o quadro exibido tem no
 * máximo 420px: num retina são 840px de dispositivo para 720px de fonte,
 * quase 1:1. Vídeo pequeno e nítido vale mais que vídeo grande e borrado.
 *
 * POR QUE QUADROS E NÃO O <video>
 * Rolagem controlando `video.currentTime` engasga: o navegador precisa
 * procurar o quadro-chave mais próximo e decodificar até ele, e no Firefox e
 * no Safari isso trava visivelmente. Aqui cada posição de scroll é só um
 * `drawImage` de imagem já decodificada.
 */

const FRAMES = 48;
const frameSrc = (index: number) => `/sequencia/${String(index).padStart(3, '0')}.webp`;

/** Dimensão nativa dos quadros já recortados. */
const FRAME = { width: 720, height: 1184 };

export function Signal() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  /** Último quadro efetivamente desenhado — evita redesenhar o mesmo. */
  const drawnRef = useRef(-1);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  /**
   * Desenha o quadro inteiro no canvas — sem recorte: o elemento tem a mesma
   * proporção da fonte. Se o quadro pedido ainda não carregou, procura para
   * trás o mais recente que já está pronto, para a cena nunca piscar em
   * branco durante a rolagem.
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

  /** Dimensiona o canvas ao contêiner, respeitando a densidade da tela. */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    /* Teto de 2: acima disso o ganho é invisível e a fonte (720px) já não
       tem detalhe para entregar — só custaria memória de textura. */
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
      /* O primeiro quadro é o que aparece antes de qualquer rolagem, então
         ele entra na frente da fila; o resto chega em segundo plano. */
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

  /* Com menos movimento a sequência não roda: fica o quadro do toque, que é
     o instante que a seção existe para mostrar. */
  useEffect(() => {
    if (!reduced) return;
    const index = Math.round(FRAMES * 0.45);
    const image = imagesRef.current[index];
    if (!image) return;
    const show = () => draw(index);
    if (image.complete) show();
    else image.onload = show;
  }, [reduced, draw]);

  useMotionValueEvent(scrollYProgress, 'change', (raw) => {
    if (reduced) return;
    /* A sequência termina antes do fim do trecho rolável: o último quarto
       existe para a frase ficar legível parada, sem obrigar a pessoa a ler
       enquanto a cena ainda se mexe. */
    const progress = Math.min(1, Math.max(0, raw) / 0.78);

    draw(Math.min(FRAMES - 1, Math.floor(progress * FRAMES)));

    if (textRef.current) {
      textRef.current.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.3) / 0.3)));
      textRef.current.style.transform = `translate3d(0, ${(1 - Math.min(1, progress / 0.6)) * 18}px, 0)`;
    }
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    if (readoutRef.current) {
      readoutRef.current.textContent = String(Math.round(progress * 100)).padStart(3, '0');
    }
  });

  return (
    <section
      ref={ref}
      aria-labelledby="sinal-titulo"
      className={reduced ? 'relative' : 'relative h-[170vh] md:h-[240vh]'}
    >
      <div
        className={
          reduced
            ? 'section-y relative overflow-hidden'
            : /* Respiro menor no celular: lá o conteúdo empilha (quadro sobre
                 frase) e com o respiro do desktop ele não cabia na tela travada
                 — o quadro passava por baixo do header e o rodapé era cortado. */
              'sticky top-0 flex h-svh flex-col justify-center overflow-hidden py-[calc(var(--header-h)+0.5rem)] lg:py-[calc(var(--header-h)+1.5rem)]'
        }
      >
        {/* Atmosfera da própria página — a cena agora é um objeto dentro da
            seção, não o fundo dela. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(55% 50% at 32% 50%, rgb(var(--glow) / 0.20), transparent 72%)',
          }}
        />
        <div className="grid-layer" />

        <div className="shell relative flex flex-1 items-center">
          <div className="grid w-full items-center gap-7 lg:grid-cols-12 lg:gap-14">
            {/* O quadro. `max-w-[420px]` é o limite de nitidez, não estética:
                acima disso um retina passa a ampliar a fonte de 720px. */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-[236px] sm:max-w-[300px] lg:mx-0 lg:max-w-[420px]">
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 rounded-[36px] opacity-70 blur-2xl"
                  style={{
                    background:
                      'radial-gradient(circle at 60% 50%, rgb(var(--glow) / 0.35), transparent 68%)',
                  }}
                />
                <div className="relative overflow-hidden rounded-bento border border-line/70 bg-ink-900 shadow-e3">
                  <canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    className="block h-auto w-full"
                    style={{ aspectRatio: `${FRAME.width} / ${FRAME.height}` }}
                  />
                </div>
              </div>
            </div>

            {/* A luz aponta para a direita, e é ali que a frase está. */}
            <div className="lg:col-span-7">
              <div
                ref={textRef}
                style={{ opacity: reduced ? 1 : 0 }}
                className="max-w-xl will-change-transform"
              >
                {/* `display-lg`, não `display-xl`: o hero já usa o tamanho máximo, e
                    este é um segundo momento. Em xl a frase abria em cinco linhas
                    e passava a competir com o quadro em vez de acompanhá-lo. */}
                <h2 id="sinal-titulo" className="text-display-md text-title lg:text-display-lg">
                  Antes da primeira linha de código, a gente descobre{' '}
                  <span className="text-brand-soft">qual número precisa mudar.</span>
                </h2>
                <p className="mt-4 max-w-md text-body-sm text-body lg:mt-6 lg:text-lead">
                  O diagnóstico vem antes da proposta. Sem ele, o que se entrega é opinião cara —
                  e opinião não move indicador.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leitura do instrumento, na aresta de baixo */}
        <div className="shell relative">
          <div className="h-px w-full bg-line/70">
            <span
              ref={barRef}
              style={{ transform: reduced ? 'scaleX(1)' : 'scaleX(0)' }}
              className="block h-px w-full origin-left bg-gradient-to-r from-brand to-accent"
            />
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-label uppercase text-muted">
            <span>Sinal</span>
            <span>
              <span ref={readoutRef}>{reduced ? '100' : '000'}</span> / 100
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
