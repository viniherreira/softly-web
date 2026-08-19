/** Formatação pt-BR centralizada — nenhum componente formata número na mão. */

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const brlCents = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

export const formatCurrency = (value: number, withCents = false): string =>
  withCents ? brlCents.format(value) : brl.format(value);

/** Só o número, sem o "R$" — para exibir o cifrão em outro tamanho. */
export const formatCurrencyValue = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value);

export const formatNumber = (value: number, decimals = 0): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(`${iso}T12:00:00`),
  );

export const formatDateShort = (iso: string): string =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(`${iso}T12:00:00`),
  );

/** (48) 98844-0132 a partir de 5548988440132 */
export const formatPhone = (digits: string): string => {
  const local = digits.replace(/\D/g, '').replace(/^55/, '');
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return digits;
};
