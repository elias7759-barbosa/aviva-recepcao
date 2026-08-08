# URL Antuérpia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar uma entrada `/antuerpia/` da mesma ficha, permanentemente travada em Antuérpia, enquanto a entrada principal permite somente Bruxelas e Namur.

**Architecture:** `index.html` detectará um modo operacional explícito na URL e separará sede efetiva de sede persistida. Um arquivo mínimo `antuerpia/index.html` encaminhará para a aplicação compartilhada com `?terminal=antuerpia`, sem duplicar formulário ou lógica.

**Tech Stack:** HTML, CSS e JavaScript sem framework; Node.js para testes locais; GitHub Pages.

## Global Constraints

- Sem framework, build ou CDN externa.
- Compatível com Chrome antigo e macOS High Sierra.
- Nenhum endpoint, token, senha ou identificação de aparelho na URL ou no repositório.
- Nenhum teste envia cadastro real.
- Antuérpia fica travada; somente Bruxelas e Namur podem alternar na URL principal.

---

### Task 1: Contrato testável dos modos operacionais

**Files:**
- Modify: `tests/teste-casas-frontend.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `CONFIG.SEDES`, `getSedeAtualId()`, `renderSedeBadge()`.
- Produces: `getModoTerminal(): string`, `getSedesPermitidas(): Array`, `sedeEstaTravada(): boolean`.

- [ ] **Step 1: Write the failing test**

Adicionar verificações de que o modo padrão contém somente `bruxelas` e `namur`, que `terminal=antuerpia` fixa a sede efetiva e que o clique do selo é desativado nesse modo.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/teste-casas-frontend.js`
Expected: FAIL nas regras do modo Antuérpia.

- [ ] **Step 3: Write minimal implementation**

Implementar as três funções, filtrar os selects pela lista permitida, fazer `getSedeAtualId()` devolver `antuerpia` no modo travado e ocultar a troca de sede.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/teste-casas-frontend.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/teste-casas-frontend.js
git commit -m "feat: add locked Antwerp terminal mode"
```

### Task 2: Entrada pública dedicada

**Files:**
- Create: `antuerpia/index.html`
- Modify: `tests/teste-casas-frontend.js`

**Interfaces:**
- Consumes: parâmetro `terminal=antuerpia` da Task 1.
- Produces: caminho público `/antuerpia/`.

- [ ] **Step 1: Write the failing test**

Verificar que `antuerpia/index.html` existe, não contém ficha duplicada e encaminha para `../?terminal=antuerpia`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/teste-casas-frontend.js`
Expected: FAIL porque a entrada ainda não existe.

- [ ] **Step 3: Write minimal implementation**

Criar HTML pequeno com redirecionamento por `location.replace('../?terminal=antuerpia')` e link de contingência para o mesmo destino.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/teste-casas-frontend.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add antuerpia/index.html tests/teste-casas-frontend.js
git commit -m "feat: add Antwerp reception URL"
```

### Task 3: Documentação e verificação visual

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-08-08-url-antuerpia.md`

**Interfaces:**
- Consumes: URLs e comportamento implementados nas Tasks 1 e 2.
- Produces: instruções operacionais para a recepção.

- [ ] **Step 1: Document exact URLs and rules**

Registrar a URL principal, `/antuerpia/`, a trava e o fato de que ambas usam a mesma aplicação.

- [ ] **Step 2: Run complete local verification**

Run: `node tests/teste-casas-frontend.js` e `node verificar-logica-local.js` no backend.
Expected: todos os testes passam.

- [ ] **Step 3: Verify in browser without submitting**

Abrir as duas URLs locais; comprovar Bruxelas/Namur na principal e selo travado em Antuérpia na dedicada.

- [ ] **Step 4: Mark this plan complete and commit**

```bash
git add README.md docs/superpowers/plans/2026-08-08-url-antuerpia.md
git commit -m "docs: record reception terminal URLs"
```
