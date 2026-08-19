import { cn } from '@/lib/utils';

/**
 * Avatares sobrepostos da prova social.
 * Sem foto de cliente disponível, usamos as iniciais sobre um gradiente azul —
 * coerente com a marca e sem cara de banco de imagem.
 * TODO: quando houver fotos, trocar por <Image> circular (96×96, AVIF).
 */
export function AvatarStack({
  people,
  className,
}: {
  people: { initials: string; name: string }[];
  className?: string;
}) {
  return (
    <div className={cn('flex items-center', className)}>
      {people.map((person, index) => (
        <span
          key={person.name}
          title={person.name}
          style={{ zIndex: people.length - index }}
          className={cn(
            'relative grid h-10 w-10 place-items-center rounded-pill border-2 border-bg bg-gradient-to-br from-brand to-accent font-mono text-[0.6875rem] font-medium text-white transition-transform duration-300 ease-expo hover:-translate-y-1',
            index > 0 && '-ml-3',
          )}
        >
          <span aria-hidden="true">{person.initials}</span>
          <span className="sr-only">{person.name}</span>
        </span>
      ))}
    </div>
  );
}
