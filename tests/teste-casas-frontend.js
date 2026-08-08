'use strict';

const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');

const checks = [
  ['três classificações ministeriais existem', () => {
    assert.match(html, /value="JOVEM"/);
    assert.match(html, /value="JOVEM_CASADO"/);
    assert.match(html, /value="CASADO"/);
  }],
  ['classificação organizacional entra no payload', () => {
    assert.match(html, /classificacao_organizacional/);
    assert.doesNotMatch(html, /Classificação ministerial/);
  }],
  ['família usa integrantes_familia e não membros_familia', () => {
    assert.match(html, /integrantes_familia/);
    assert.doesNotMatch(html, /payload\[F\.membrosFamilia\]/);
  }],
  ['integrante possui telefone opcional', () => {
    assert.match(html, /familia-telefone/);
  }],
  ['idade máxima visível do integrante é 17', () => {
    assert.match(html, /data-max-idade="17"/);
  }],
  ['bloqueios internos não aparecem como texto ao operador', () => {
    assert.doesNotMatch(html, />[^<]*(envio automático bloqueado|autorização pendente)[^<]*</i);
  }],
  ['frontend reage ao código canônico de token revogado', () => {
    assert.match(html, /data\.erro === "TERMINAL_NAO_AUTORIZADO"/);
  }],
  ['consentimento informa telefone opcional dos menores e usa nova versão', () => {
    assert.match(html, /PT-v5-2026-08/);
    assert.match(html, /nome, a idade e o telefone opcional dos menores/i);
  }],
  ['selo da sede é um botão de troca operacional', () => {
    assert.match(html, /id="sede-badge"[^>]*type="button"/);
  }],
  ['ordem visual aprovada está preservada', () => {
    const ids = ['f-nome', 'f-telefone', 'pv-sim', 'f-comuna', 'familia-lista', 'f-email', 'f-categoria', 'f-idioma', 'f-observacoes', 'field-classificacao'];
    const positions = ids.map(id => html.indexOf(`id="${id}"`));
    assert.ok(positions.every(n => n >= 0));
    assert.deepStrictEqual(positions.slice().sort((a,b) => a-b), positions);
  }]
];

let ok = 0;
for (const [name, fn] of checks) {
  try {
    fn();
    ok++;
    console.log('✅ ' + name);
  } catch (error) {
    console.error('❌ ' + name + ' — ' + error.message);
  }
}

console.log(`\n=== RESULTADO FRONTEND ===\n${ok} passaram, ${checks.length - ok} falharam.`);
process.exitCode = ok === checks.length ? 0 : 1;
