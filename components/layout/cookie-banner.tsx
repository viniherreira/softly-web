'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { applyConsentToTags, defaultConsent, readConsent, writeConsent, type ConsentState } from '@/lib/analytics';
import { EASE_EXPO } from '@/lib/motion';

/**
 * Banner de consentimento (LGPD).
 * Nada de análise ou marketing dispara antes do aceite — o Consent Mode v2
 * começa negado em app/layout.tsx e só é liberado aqui.
 * O link "Preferências de cookies" do rodapé reabre este painel.
 */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setConsent(stored);
      applyConsentToTags(stored);
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reopen = () => {
      const stored = readConsent();
      if (stored) setConsent(stored);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener('softly:open-consent', reopen);
    return () => window.removeEventListener('softly:open-consent', reopen);
  }, []);

  const save = useCallback((next: ConsentState) => {
    writeConsent(next);
    setConsent(next);
    setOpen(false);
    setDetails(false);
  }, []);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-label="Preferências de cookies"
          aria-modal="false"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO } }}
          exit={{ opacity: 0, y: 40, transition: { duration: 0.3, ease: EASE_EXPO } }}
          className="fixed inset-x-4 bottom-4 z-[130] max-w-xl sm:bottom-6 sm:left-6 sm:right-auto"
        >
          <div className="glass rounded-card p-6 shadow-float">
            <p className="font-mono text-label uppercase text-brand-soft">Privacidade</p>
            <p className="mt-3 text-body-sm text-body">
              Usamos cookies necessários para o site funcionar e, com a sua autorização, cookies de
              análise e marketing para entender o que funciona por aqui. Você escolhe.{' '}
              <Link
                href="/politica-de-privacidade"
                className="text-brand-soft underline underline-offset-4"
              >
                Ler a política
              </Link>
              .
            </p>

            <AnimatePresence initial={false}>
              {details ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', transition: { duration: 0.35, ease: EASE_EXPO } }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.25, ease: EASE_EXPO } }}
                  className="overflow-hidden"
                >
                  <ul className="mt-5 space-y-3 border-t border-line/60 pt-5">
                    <li className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-body-sm font-bold text-title">Necessários</p>
                        <p className="text-body-sm text-muted">
                          Tema escolhido, segurança do formulário. Não podem ser desativados.
                        </p>
                      </div>
                      <Switch checked disabled aria-label="Cookies necessários (sempre ativos)" />
                    </li>
                    <li className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-body-sm font-bold text-title">Análise</p>
                        <p className="text-body-sm text-muted">
                          Google Analytics 4 com IP anonimizado, em dados agregados.
                        </p>
                      </div>
                      <Switch
                        checked={consent.analytics}
                        onCheckedChange={(checked) =>
                          setConsent((current) => ({ ...current, analytics: checked }))
                        }
                        aria-label="Cookies de análise"
                      />
                    </li>
                    <li className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-body-sm font-bold text-title">Marketing</p>
                        <p className="text-body-sm text-muted">
                          Mensuração de campanhas (Meta Pixel).
                        </p>
                      </div>
                      <Switch
                        checked={consent.marketing}
                        onCheckedChange={(checked) =>
                          setConsent((current) => ({ ...current, marketing: checked }))
                        }
                        aria-label="Cookies de marketing"
                      />
                    </li>
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                onClick={() => save({ necessary: true, analytics: true, marketing: true })}
              >
                Aceitar todos
              </Button>
              {details ? (
                <Button size="sm" variant="outline" onClick={() => save(consent)}>
                  Salvar escolha
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setDetails(true)}>
                  Personalizar
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => save({ necessary: true, analytics: false, marketing: false })}
              >
                Só os necessários
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
