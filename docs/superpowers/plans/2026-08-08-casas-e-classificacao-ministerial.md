# Casas e Classificação Ministerial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Registrar principal e menores da mesma casa em linhas consecutivas da mesma aba, preparar classificações ministeriais e bloquear internamente mensagens para menores.

**Architecture:** A ficha continuará como HTML/CSS/JS único e offline-first. Um POST representará a casa inteira; o Apps Script validará e gravará todas as linhas na aba da sede com o mesmo `id_familia`, retomando gravações parciais de maneira idempotente antes de responder sucesso.

**Tech Stack:** HTML5, CSS, JavaScript ES compatível com Chrome antigo, IndexedDB, Web Crypto AES-GCM, Google Apps Script, Google Sheets e testes Node locais com mocks.

## Global Constraints

- Criança: 0–10 anos; adolescente: 11–14; jovem menor: 15–17; cadastro próprio: 18+.
- Classificação principal exclusiva: `JOVEM`, `JOVEM_CASADO` ou `CASADO`.
- Menor pode ter telefone opcional, mas o bloqueio de mensagens é interno e invisível na ficha.
- Não ativar nem modificar envio real de WhatsApp nesta fase.
- Mesma aba da sede, linhas consecutivas e mesmo `id_familia`; nenhuma aba/linha real será apagada.
- Sem framework, CDN, sintaxe moderna incompatível ou efeitos pesados.
- Preservar fila cifrada, consentimento, identidade visual e operação offline.
- Antes de qualquer mudança na planilha real: medir abas/cabeçalhos/dados, congelar prova e criar backup recuperável.

---

### Task 1: Contrato e testes do novo modelo

**Files:**
- Modify: `../recepcao-backend/verificar-logica-local.js`
- Modify: `../ecossistema-ministerial/recepcao-CONTRATO-DE-DADOS.md`
- Modify: `../ecossistema-ministerial/banco-google-sheets-ESPEC.md`
- Modify: `../ecossistema-ministerial/registro-art30-bem-vindos.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: design aprovado em `docs/superpowers/specs/2026-08-08-casas-e-classificacao-ministerial-design.md`.
- Produces: payload `integrantes_familia`, cabeçalho único e códigos canônicos usados pelas tarefas seguintes.

- [ ] **Step 1: Escrever testes locais que falham**

Adicionar cenários com payload principal:

```js
{
  sede: 'Bruxelas',
  acao: 'REGISTRO',
  id_familia_cliente: '11111111-1111-4111-8111-111111111111',
  classificacao_ministerial: 'CASADO',
  integrantes_familia: [
    { nome: 'Filho Criança', idade_declarada: 8, telefone_bruto: '', telefone_e164: '' },
    { nome: 'Filha Adolescente', idade_declarada: 13, telefone_bruto: '+32 470 00 00 00', telefone_e164: '+32470000000' },
    { nome: 'Filho Jovem', idade_declarada: 16, telefone_bruto: '', telefone_e164: '' }
  ]
}
```

Asserções obrigatórias: quatro linhas consecutivas na mesma aba; mesmo `id_familia`; principal com `papel_na_casa=PRINCIPAL`; menores com `papel_na_casa=INTEGRANTE`; categorias `CRIANCA`, `ADOLESCENTE`, `JOVEM`; menores com `envio_automatico_permitido=NAO` e `autorizacao_responsavel=PENDENTE`.

- [ ] **Step 2: Executar e provar falha**

Run: `cd ../recepcao-backend && node verificar-logica-local.js`

Expected: FAIL nos novos cenários porque o backend ainda escreve familiares na aba separada.

- [ ] **Step 3: Fixar nomes exatos no contrato**

Cabeçalho adicional nas abas `recepcao_<sede>`:

```text
id_familia · papel_na_casa · id_registro_principal · idade_declarada · classificacao_ministerial · envio_automatico_permitido · autorizacao_responsavel
```

Payload:

```text
id_familia_cliente: UUID v4 obrigatório
classificacao_ministerial: JOVEM | JOVEM_CASADO | CASADO
integrantes_familia: array de {nome, idade_declarada, telefone_bruto, telefone_e164}
```

Código canônico de autenticação recusada: `TERMINAL_NAO_AUTORIZADO`.

- [ ] **Step 4: Atualizar Art. 30 e README sem prometer consentimento do menor**

Documentar que o telefone opcional do menor é guardado para possível contato humano posterior; não autoriza mensagem. Remover menções à aba final `recepcao_membros_familia` e aos campos antigos já eliminados.

- [ ] **Step 5: Validar documentos e commit**

Run: `rg -n "recepcao_membros_familia|TOKEN_INVALIDO|como conheceu|convidado por|quem atendeu" README.md ../ecossistema-ministerial/recepcao-CONTRATO-DE-DADOS.md ../ecossistema-ministerial/banco-google-sheets-ESPEC.md ../ecossistema-ministerial/registro-art30-bem-vindos.md`

Expected: nenhuma referência ativa contraditória; referências históricas devem estar explicitamente marcadas como legado.

Commit: `git commit -am "test: define casas e classificacao ministerial"`

---

### Task 2: Backend atômico e idempotente

**Files:**
- Modify: `../recepcao-backend/Codigo.gs`
- Modify: `../recepcao-backend/verificar-logica-local.js`

**Interfaces:**
- Consumes: contrato da Task 1.
- Produces: `validarIntegrantesFamilia_(payload)`, `categoriaPorIdade_(idade)`, `completarCasa_(aba, payload, ids)` e resposta `{ok:true,id_registro,id_familia}`.

- [ ] **Step 1: Acrescentar testes de validação fechada**

Casos recusados sem escrita: classificação inexistente; idade negativa; idade 18+ em integrante; mais de 12 integrantes; texto acima dos limites; `acao`, `idioma`, `categoria_declarada`, `primeira_visita` ou `enviado_via` fora das listas.

- [ ] **Step 2: Acrescentar teste de falha parcial + reenvio**

O mock deve lançar erro depois de gravar o principal e o primeiro integrante. No segundo POST com o mesmo `id_cliente_uuid`, esperar todas as linhas presentes, sem duplicação, antes de `{ok:true}`.

- [ ] **Step 3: Executar e provar falhas**

Run: `cd ../recepcao-backend && node verificar-logica-local.js`

Expected: FAIL na validação fechada e na retomada parcial.

- [ ] **Step 4: Implementar validação mínima**

Usar listas:

```js
var CLASSIFICACOES = ['JOVEM', 'JOVEM_CASADO', 'CASADO'];
var IDIOMAS = ['PT', 'FR', 'NL', 'EN'];
var PRIMEIRA_VISITA = ['SIM', 'NAO'];
var ENVIADO_VIA = ['ONLINE', 'FILA_OFFLINE'];
var ACOES = ['REGISTRO', 'CORRECAO', 'ANULACAO'];
```

`categoriaPorIdade_`: 0–10 `CRIANCA`, 11–14 `ADOLESCENTE`, 15–17 `JOVEM`; 18+ é erro para integrante.

- [ ] **Step 5: Implementar escrita retomável na mesma aba**

Gerar um `id_familia` por POST novo. Antes de cada linha, procurar a chave estável composta por `id_cliente_uuid + papel_na_casa + indice_integrante`. Em reenvio, completar somente linhas faltantes. Só responder sucesso quando a contagem e os conteúdos esperados estiverem presentes.

- [ ] **Step 6: Neutralizar fórmulas**

Antes de escrever texto vindo do usuário, prefixar apóstrofo quando o primeiro caractere for `=`, `+`, `-` ou `@`. Testar nome, telefone bruto, e-mail e observações.

- [ ] **Step 7: Unificar revogação**

Trocar resposta do backend para `TERMINAL_NAO_AUTORIZADO` e atualizar testes locais.

- [ ] **Step 8: Rodar toda a suíte**

Run: `cd ../recepcao-backend && node verificar-logica-local.js`

Expected: todos os 78 testes anteriores e todos os novos testes passam; nenhum cenário anterior regride.

- [ ] **Step 9: Registrar cópia verificável do backend**

Como o backend é pasta irmã sem repositório próprio, salvar hash SHA-256 de `Codigo.gs` e `verificar-logica-local.js` no relato da execução. Não publicar no Apps Script ainda.

---

### Task 3: Ficha e fila offline

**Files:**
- Modify: `index.html`
- Create: `tests/teste-casas-frontend.js`
- Modify: `README.md`

**Interfaces:**
- Consumes: payload da Task 1 e validações da Task 2.
- Produces: rascunho com `classificacaoMinisterial` e `integrantesFamilia`; POST único por casa.

- [ ] **Step 1: Criar teste automatizado da lógica extraída**

Cobrir: 8→`CRIANCA`; 13→`ADOLESCENTE`; 16→`JOVEM`; 18 em integrante→inválido; telefone de menor mantido no payload; flags internas ausentes da interface; três classificações mutuamente exclusivas.

- [ ] **Step 2: Executar e provar falha**

Run: `node tests/teste-casas-frontend.js`

Expected: FAIL porque os campos/funções ainda não existem.

- [ ] **Step 3: Alterar o bloco Membros da Família**

Cada linha terá nome, idade 0–17 e telefone opcional. A linha vazia seguinte continuará surgindo automaticamente. Idade 18+ mostra somente “Esta pessoa precisa de um cadastro próprio.”

- [ ] **Step 4: Inserir classificação no final da ficha**

Adicionar três botões grandes e exclusivos: “Jovem”, “Jovem casado”, “Casado”. A classificação é obrigatória para o principal antes de revisar.

- [ ] **Step 5: Atualizar resumo e payload**

O resumo mostra principal, classificação e todos os menores com nome/idade/telefone informado. Criar `id_familia_cliente` no mesmo instante do UUID do registro e manter o POST como unidade única na fila cifrada.

- [ ] **Step 6: Corrigir alerta de token revogado**

O frontend deve reagir a `TERMINAL_NAO_AUTORIZADO`, mantendo a fila e mostrando o alerta existente.

- [ ] **Step 7: Rodar testes e inspeções estáticas**

Run: `node tests/teste-casas-frontend.js`

Expected: PASS em todos os casos.

Run: `rg -n "envio_automatico_permitido|autorizacao_responsavel" index.html`

Expected: esses nomes podem existir apenas no contrato/comentários técnicos; nenhum rótulo, aviso ou campo visível correspondente.

- [ ] **Step 8: Commit**

Run: `git add index.html README.md tests/teste-casas-frontend.js && git commit -m "feat: agrupa casas e classificacao ministerial"`

---

### Task 4: Migração segura e publicação controlada

**Files:**
- Modify: `../recepcao-backend/Codigo.gs`
- Create: `../recepcao-backend/MIGRACAO-CASAS.md`

**Interfaces:**
- Consumes: backend e cabeçalho final das Tasks 1–2.
- Produces: relatório congelado do estado real, backup, cabeçalhos ampliados sem exclusão e implantação verificável.

- [ ] **Step 1: Inspecionar o estado real em modo leitura**

Registrar nomes das abas, número de linhas, cabeçalhos, proteções, gatilhos e versão implantada. Redigir valores pessoais; não exportar conteúdo de visitantes.

- [ ] **Step 2: Congelar a prova**

Salvar no relato: data/hora Europe/Brussels, IDs técnicos não secretos, contagens, hashes dos códigos locais e estado `verificado: true/false` de cada item.

- [ ] **Step 3: Criar backup recuperável**

Executar o backup existente e confirmar arquivo, abas e restrição de acesso. Não avançar se não houver prova do backup.

- [ ] **Step 4: Verificar a aba legada de família**

Se vazia: manter, renomear como legado somente após aprovação explícita; não apagar. Se contiver linhas: interromper a migração estrutural, produzir mapa de transformação por `id_registro` e pedir decisão antes de escrever.

- [ ] **Step 5: Ampliar cabeçalhos sem alterar linhas existentes**

Adicionar somente as sete colunas novas ao fim das quatro abas. Linhas antigas permanecem intactas e recebem valores vazios até eventual migração separada.

- [ ] **Step 6: Publicar nova versão do Apps Script**

Comparar hash do código colado/implantado com o local quando a interface permitir; executar `verificarConfiguracao` e um POST fictício autorizado.

- [ ] **Step 7: Publicar a ficha**

Confirmar repositório limpo, fazer push dos commits aprovados e verificar que GitHub Pages entrega a nova versão sem endpoint ou token embutido.

---

### Task 5: QA visual e teste ponta a ponta

**Files:**
- Create: `outputs/QA-CASAS-TERMINAL-2026-08-08.md` no diretório da tarefa Codex.

**Interfaces:**
- Consumes: ficha publicada, Apps Script implantado e planilha migrada.
- Produces: gate final com evidência e lista explícita do que permanece não verificado.

- [ ] **Step 1: Validar visual no Mac atual**

Conferir desktop e janela estreita: hierarquia, toque, foco, contraste, classificação no fim, resumo da casa e ausência de texto interno de bloqueio.

- [ ] **Step 2: Executar cenários fictícios**

Cadastrar: adulto sozinho; família com 8/13/16 anos; adolescente com telefone; jovem adulto individual; jovem casado; casado.

- [ ] **Step 3: Testar offline e retomada**

Desligar rede, cadastrar família fictícia, confirmar fila, religar, verificar envio e quatro linhas consecutivas com mesmo `id_familia`.

- [ ] **Step 4: Testar revogação**

Usar token fictício inválido, confirmar alerta visível e fila preservada; restaurar token de teste e confirmar retomada.

- [ ] **Step 5: Conferir bloqueios internos**

Na planilha, todo menor deve ter `envio_automatico_permitido=NAO`; a ficha não deve mostrar essa informação; nenhuma rotina de WhatsApp deve estar ativa.

- [ ] **Step 6: Produzir relatório final**

Incluir screenshots, hashes, contagens, resultados de testes, URLs públicas sem segredos e `verificado: false` para FileVault, 2FA ou aparelho futuro que ainda não tenha sido conferido.

