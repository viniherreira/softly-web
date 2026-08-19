'use client';

import { motion, type Variants } from 'framer-motion';
import { Fragment } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * SplitText feito à mão (sem plugin pago do GSAP).
 *
 * `mode="word"` → revelação linha a linha com máscara: cada palavra sobe de
 * baixo dentro de um contêiner com overflow-hidden, com atraso escalonado.
 * `mode="char"` → revelação por caractere. Usada em apenas dois títulos do
 * site (hero e CTA final) — de propósito, para não cansar a leitura.
 *
 * Acessibilidade: o texto original fica em um <span class="sr-only"> e os
 * fragmentos animados são aria-hidden, então o leitor de tela lê a frase
 * inteira, não letra por letra.
 */
type SplitTextProps = {
  text: string;
  className?: string;
  /**
   * 'char' e 'word' fatiam o texto. 'line' revela a linha inteira como uma peça
   * só — é o modo obrigatório para texto com gradiente: `background-clip: text`
   * não atravessa filhos com transform/will-change (eles viram camada própria e
   * o texto sumiria), então o gradiente precisa estar no mesmo elemento que anima.
   */
  mode?: 'word' | 'char' | 'line';
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  /** Anima ao entrar na viewport em vez de na montagem. */
  whileInView?: boolean;
  /**
   * Como o texto é anunciado:
   *  'auto' — word/line ficam legíveis como texto normal (os <span> são inline,
   *           o leitor de tela lê a frase inteira); char ganha uma cópia
   *           sr-only, porque letra em span separado quebra a leitura.
   *  'none' — o elemento pai já tem aria-label; aqui tudo vira aria-hidden e
   *           o texto aparece uma única vez no DOM (bom para SEO).
   */
  aria?: 'auto' | 'none';
};

export function SplitText({
  text,
  className,
  mode = 'word',
  delay = 0,
  stagger = mode === 'char' ? 0.022 : 0.08,
  as: Tag = 'span',
  whileInView = false,
  aria = 'auto',
}: SplitTextProps) {
  const reduced = usePrefersReducedMotion();
  const words = text.split(' ');

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  const piece: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.15 } } }
    : mode === 'char'
      ? {
          hidden: { y: '90%', opacity: 0 },
          visible: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
        }
      : {
          hidden: { y: '110%' },
          visible: { y: '0%', transition: { duration: 0.9, ease: EASE_EXPO } },
        };

  const animationProps = whileInView
    ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: { once: true, amount: 0.4 } }
    : { initial: 'hidden' as const, animate: 'visible' as const };

  const hidden = aria === 'none' || mode === 'char';
  const needsSrCopy = aria === 'auto' && mode === 'char';

  if (mode === 'line') {
    return (
      <Tag className="block">
        <span className="line-mask" aria-hidden={hidden || undefined}>
          <motion.span
            variants={piece}
            {...animationProps}
            transition={{ delay }}
            className={cn('inline-block will-change-transform', className)}
          >
            {text}
          </motion.span>
        </span>
      </Tag>
    );
  }

  return (
    <Tag className={cn('block', className)}>
      {needsSrCopy ? <span className="sr-only">{text}</span> : null}
      <motion.span
        aria-hidden={hidden || undefined}
        variants={container}
        {...animationProps}
        className="block"
      >
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="line-mask inline-block align-bottom">
              {mode === 'char' ? (
                <span className="inline-block">
                  {Array.from(word).map((char, charIndex) => (
                    <motion.span
                      key={`${char}-${charIndex}`}
                      variants={piece}
                      className="inline-block will-change-transform"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ) : (
                <motion.span variants={piece} className="inline-block will-change-transform">
                  {word}
                </motion.span>
              )}
            </span>
            {wordIndex < words.length - 1 ? <span> </span> : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
