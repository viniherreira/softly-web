/**
 * Mede o contraste dos pares texto/fundo do tema contra a WCAG 2.1 AA.
 * Rode sempre que mexer em --ink-900 / --ink-800 / --body / --muted:
 * clarear o fundo derruba o texto secundário, que vive perto do mínimo.
 *
 *   node _contraste.mjs
 */
import fs from 'node:fs';

const css = fs.readFileSync('app/globals.css', 'utf8');

/** Lê `--nome: 12 34 56;` do :root. */
function token(nome) {
  const m = css.match(new RegExp(`--${nome}:\\s*([0-9]+)\\s+([0-9]+)\\s+([0-9]+)\\s*;`));
  if (!m) throw new Error(`token --${nome} não encontrado`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

const canal = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luz = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const razao = (a, b) => {
  const [x, y] = [luz(a), luz(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const bg = token('ink-900');
const surface = token('ink-800');
const surface2 = token('ink-700');

const pares = [
  ['texto principal / fundo', token('white'), bg, 4.5],
  ['texto principal / superfície', token('white'), surface, 4.5],
  ['corpo / fundo', token('slate-300'), bg, 4.5],
  ['corpo / superfície', token('slate-300'), surface, 4.5],
  ['secundário / fundo', token('slate-500'), bg, 4.5],
  ['secundário / superfície', token('slate-500'), surface, 4.5],
  ['secundário / superfície 2', token('slate-500'), surface2, 4.5],
  ['azul de texto / fundo', token('blue-400'), bg, 4.5],
  ['azul de texto / superfície', token('blue-400'), surface, 4.5],
  ['branco / botão azul', token('white'), token('blue-600'), 4.5],
  ['acento / fundo', token('cyan-400'), bg, 4.5],
];

// A borda de card é decorativa: a WCAG 1.4.11 cobre limite de controle e
// estado, não fio de separação. Fica como leitura, sem mínimo.
const bordaInfo = razao(token('border'), bg);

let falhou = false;
const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
console.log(`fundo ${hex(bg)} · superfície ${hex(surface)} · superfície-2 ${hex(surface2)}\n`);

for (const [nome, fg, back, minimo] of pares) {
  const r = razao(fg, back);
  const ok = r >= minimo;
  if (!ok) falhou = true;
  console.log(`${ok ? 'ok  ' : 'FALHA'} ${r.toFixed(2).padStart(5)}:1  (min ${minimo})  ${nome}`);
}

console.log(`\ninfo  ${bordaInfo.toFixed(2).padStart(5)}:1          borda de card / fundo (decorativa, sem mínimo)`);
console.log(falhou ? '\nAlgum par está abaixo do mínimo.' : '\nTodos os pares passam.');
process.exit(falhou ? 1 : 0);
