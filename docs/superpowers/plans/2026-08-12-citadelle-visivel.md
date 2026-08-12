# Citadelle visível em Namur — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reenquadrar a Citadelle para que apareça integralmente no palco territorial de Namur antes da ficha.

**Architecture:** Uma moldura CSS exclusiva recorta o espaço vazio do JPG sem gerar um novo ativo. O recorte tem ajustes separados para panorama e celular e não altera dados, eventos ou envio.

**Tech Stack:** HTML, CSS responsivo e testes Node existentes.

## Global Constraints

- Não alterar a composição de Bruxelas.
- Não alterar campos, consentimento, planilha ou envio.
- Não aumentar o `padding-top` já reservado para o território.

---

### Task 1: Reenquadrar a Citadelle

**Files:**
- Modify: `index.html`
- Test: `tests/teste-casas-frontend.js`

**Interfaces:**
- Consumes: `#sede-visual-namur` e `assets/landmarks/citadelle-namur-gravura.jpg`.
- Produces: `.sede-visual-citadelle-crop`, uma moldura visual sem eventos.

- [ ] Adicionar um teste que exija a moldura, `overflow: hidden`, `object-fit: cover` e enquadramento móvel próprio.
- [ ] Rodar o teste e confirmar falha pela ausência da moldura.
- [ ] Envolver apenas a Citadelle na moldura e aplicar o recorte responsivo mínimo.
- [ ] Rodar a suíte e confirmar aprovação completa.
- [ ] Conferir visualmente Namur em panorama e celular, sem regressão em Bruxelas.
- [ ] Publicar e validar o artefato servido pelo GitHub Pages.
