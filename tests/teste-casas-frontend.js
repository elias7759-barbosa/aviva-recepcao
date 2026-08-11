'use strict';

const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');
const antuerpiaPath = __dirname + '/../antuerpia/index.html';

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
  }],
  ['modo principal permite somente Bruxelas e Namur', () => {
    assert.match(html, /function getSedesPermitidas\(\)/);
    assert.match(html, /return CONFIG\.SEDES\.filter/);
    assert.match(html, /sede\.id !== "antuerpia"/);
  }],
  ['modo Antuérpia é detectado pela URL e trava a sede', () => {
    assert.match(html, /terminal=antuerpia/);
    assert.match(html, /function sedeEstaTravada\(\)/);
    assert.match(html, /if \(sedeEstaTravada\(\)\) \{\s*return "antuerpia";/);
  }],
  ['modo Antuérpia desativa o selo e oculta a troca de sede', () => {
    assert.match(html, /sede-badge[^\n]+disabled = sedeEstaTravada\(\)/);
    assert.match(html, /settings-troca-sede[^\n]+classList\.toggle\("oculto", sedeEstaTravada\(\)\)/);
  }],
  ['URL dedicada de Antuérpia reutiliza a aplicação principal', () => {
    assert.ok(fs.existsSync(antuerpiaPath));
    const entrada = fs.readFileSync(antuerpiaPath, 'utf8');
    assert.match(entrada, /\.\.\/\?terminal=antuerpia/);
    assert.doesNotMatch(entrada, /id="cadastro-form"/);
  }],
  ['nova identidade usa a paleta oficial e o lampião local', () => {
    assert.match(html, /--id-tinta:\s*#14100C/i);
    assert.match(html, /--id-pergaminho:\s*#E4DACA/i);
    assert.match(html, /--id-rubrica:\s*#A8402C/i);
    assert.match(html, /assets\/aviva-lampiao-marfinho-180x180\.png/);
  }],
  ['nova identidade cria uma abertura editorial com azul, rubrica e lampião', () => {
    const abertura = html.indexOf('class="brand-stage"');
    const ficha = html.indexOf('<main class="content">');
    assert.ok(abertura >= 0 && abertura < ficha);
    assert.match(html, /class="brand-stage-sede"/);
    assert.match(html, /class="brand-stage-rubrica"/);
    assert.match(html, /\.brand-stage[\s\S]*var\(--id-azul\)/);
    assert.match(html, /\.brand-stage[\s\S]*var\(--id-rubrica\)/);
  }],
  ['configuração inicial recebe a mesma linguagem editorial', () => {
    assert.match(html, /\.setup-card::before/);
    assert.match(html, /\.setup-lema::before/);
    assert.match(html, /\.setup-lema::after/);
  }],
  ['abertura editorial se reorganiza para a ficha vertical', () => {
    const mobile = html.match(/@media \(max-width: 540px\) \{([\s\S]*?)\n      \}/g);
    assert.ok(mobile && mobile.some(rule => /\.brand-stage-rubrica\s*\{[\s\S]*margin/.test(rule)));
    assert.ok(mobile && mobile.some(rule => /\.topbar-controles\s*\{[\s\S]*gap/.test(rule)));
    assert.ok(mobile && mobile.some(rule => /\.content\s*\{[\s\S]*box-shadow:\s*none/.test(rule)));
  }],
  ['versão profissional usa território, papel rasgado e pinceladas', () => {
    assert.match(html, /assets\/landmarks\/atomium-gravura\.jpg/);
    assert.match(html, /assets\/landmarks\/citadelle-namur-gravura\.jpg/);
    assert.match(html, /class="brand-landmark brand-landmark-atomium"/);
    assert.match(html, /class="brand-landmark brand-landmark-citadelle"/);
    assert.match(html, /class="paper-tear paper-tear-top"/);
    assert.match(html, /class="brand-brush brand-brush-blue"/);
    assert.match(html, /\.brand-stage-sede\s*\{[\s\S]*margin-top:\s*24px/);
  }],
  ['equilíbrio editorial remove ruído sem empobrecer a identidade', () => {
    assert.doesNotMatch(html, /class="brand-brush brand-brush-rubrica"/);
    assert.doesNotMatch(html, /class="sede-visual-lampiao"/);
    assert.match(html, /\.brand-stage::before,\s*\.brand-stage::after\s*\{\s*display:\s*none/);
    assert.match(html, /\.brand-brush-blue\s*\{[\s\S]*opacity:\s*\.48/);
  }],
  ['identidade monumental acompanha a sede selecionada', () => {
    assert.match(html, /id="sede-visual-bruxelas"/);
    assert.match(html, /id="sede-visual-namur"/);
    assert.match(html, /class="sede-visual-nome"[^>]*>BRUXELAS</);
    assert.match(html, /class="sede-visual-nome"[^>]*>NAMUR</);
    assert.match(html, /data-sede-visual/);
    assert.match(html, /setAttribute\("data-sede-visual", sede \? sede\.id : ""\)/);
    assert.match(html, /assets\/aviva-lampiao-chama-720\.png/);
    assert.match(html, /\.brand-stage-lamp\s*\{[\s\S]*bottom:\s*-154px[\s\S]*left:\s*-92px[\s\S]*aviva-lampiao-chama-720\.png/);
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
