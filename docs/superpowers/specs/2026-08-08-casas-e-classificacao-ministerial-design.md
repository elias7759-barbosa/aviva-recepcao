# Design — Casas, familiares e classificação ministerial

**Projeto:** Terminal de Recepção Bem-vindos — Aviva Church  
**Data:** 08/ago/2026  
**Estado:** aguardando revisão final do Pastor antes da implementação

## 1. Objetivo

Permitir que a recepção registre uma casa e seus integrantes de modo visualmente agrupado, sem transformar todos em destinatários automáticos. O sistema deve reconhecer crianças, adolescentes, jovens, jovens casados e casados para apoiar o acolhimento futuro por mensagens pré-aprovadas.

## 2. Regras aprovadas

### 2.1 Faixas e cadastros

| Situação | Faixa/regra | Forma de cadastro |
|---|---|---|
| Criança | 0–10 anos | Integrante vinculado ao responsável |
| Adolescente | 11–14 anos | Integrante vinculado ao responsável |
| Jovem solteiro | 15 anos ou mais, sem limite máximo | Cadastro próprio |
| Jovem casado | Casado e ligado ministerialmente aos jovens | Cadastro próprio e nova casa |
| Casado | Casado, fora da classificação jovem | Cadastro próprio e nova casa |

Um jovem solteiro com 18 anos ou mais recebe cadastro próprio mesmo quando chega com os pais. Uma pessoa casada nunca entra como integrante subordinado à casa dos pais.

### 2.2 Classificação feita pela recepção

No final da ficha principal haverá uma escolha única, marcada pelo irmão que está preenchendo:

- `JOVEM`
- `JOVEM_CASADO`
- `CASADO`

O visitante não precisa escolher essa classificação. O agente futuro não calcula nem altera a categoria: ele apenas lê o valor marcado pela recepção.

### 2.3 Telefones e autorização

- O contato principal da casa possui telefone obrigatório.
- Criança não terá telefone usado para mensagens automáticas.
- Adolescente pode ter telefone opcionalmente registrado.
- O telefone do adolescente nasce com `envio_automatico_permitido=NAO` e `autorizacao_responsavel=PENDENTE`.
- O agente futuro nunca envia diretamente ao adolescente nessa condição.
- Uma pessoa da Aviva poderá conversar posteriormente com os pais e registrar autorização específica; esse fluxo não pertence a esta implementação inicial.
- Jovem com cadastro próprio pode ser destinatário, desde que o consentimento do próprio titular esteja válido.

## 3. Modelo aprovado: linhas hierárquicas na mesma aba

Todas as pessoas da casa ficam na mesma aba da sede, em linhas consecutivas, ligadas pelo mesmo `id_familia`.

Exemplo:

| id_familia | papel_na_casa | nome | categoria | idade | telefone | envio automático |
|---|---|---|---|---:|---|---|
| FAM-BXL-000001 | PRINCIPAL | Carlos Silva | CASADO | 38 | +32… | conforme consentimento |
| FAM-BXL-000001 | INTEGRANTE | Pedro Silva | ADOLESCENTE | 13 | +32… | NÃO |
| FAM-BXL-000001 | INTEGRANTE | Ana Silva | CRIANCA | 8 | — | NÃO |
| FAM-BXL-000002 | PRINCIPAL | Lucas Santos | JOVEM | 22 | +32… | conforme consentimento |
| FAM-BXL-000003 | PRINCIPAL | João Souza | JOVEM_CASADO | 24 | +32… | conforme consentimento |

Não haverá aba separada `recepcao_membros_familia` no modelo final. Durante a migração, ela só poderá ser desativada depois de confirmar que não contém dados reais ou depois de migrá-los com prova e backup. Nenhuma aba ou linha será apagada automaticamente.

## 4. Alterações na ficha

### 4.1 Cadastro principal

Permanecem os campos atuais aprovados: consentimento, nome, telefone, e-mail opcional, primeira visita, idioma, comuna, observações enquanto não houver decisão de removê-las e demais elementos já existentes.

Será acrescentada no final da ficha a classificação ministerial de escolha única:

- Jovem
- Jovem casado
- Casado

### 4.2 Integrantes da casa

O bloco hoje chamado “Membros da Família” continuará visualmente simples e terá:

- nome;
- idade;
- telefone opcional;
- categoria calculada pela idade para 0–14 anos;
- indicação visível de que telefone de adolescente não autoriza mensagem automática.

O bloco aceitará somente crianças e adolescentes. Ao informar idade igual ou superior a 15 anos, a ficha orientará a fazer um cadastro próprio, sem gravar essa pessoa como integrante subordinado.

## 5. Contrato de dados

O envio continuará sendo um único POST e uma única unidade de fila offline. O payload passará a conter:

- dados do cadastro principal;
- `id_familia_cliente`, UUID criado no aparelho;
- `classificacao_ministerial` do principal;
- `integrantes_familia`, cada um com nome, idade e telefone opcional.

O servidor gerará o `id_familia` definitivo e gravará principal e integrantes na mesma aba. Cada linha terá `id_registro`, `id_familia`, `papel_na_casa` e `id_registro_principal`.

O backend só responderá `ok:true` quando todas as linhas da casa tiverem sido gravadas. Em reenvio, deverá completar linhas faltantes antes de confirmar sucesso, eliminando a atual possibilidade de gravação parcial silenciosa.

## 6. Preparação para WhatsApp

Esta fase não enviará mensagens. Apenas preparará os dados e as travas.

O futuro agente poderá selecionar modelos pré-aprovados usando:

- categoria explícita do cadastro principal;
- presença de crianças;
- presença de adolescentes;
- idioma;
- sede;
- consentimento e bloqueio de envio.

Exemplos de composição:

- principal `CASADO` + criança → boas-vindas ao adulto + informação do ministério infantil;
- principal `CASADO` + adolescente → boas-vindas ao adulto + informação do grupo de adolescentes;
- principal `JOVEM` → boas-vindas + informação do grupo de jovens;
- principal `JOVEM_CASADO` → boas-vindas + informação adequada aos jovens casados, sem dedução automática adicional.

Os integrantes nunca serão destinatários por simples presença na casa. Um adolescente com telefone continua bloqueado até autorização posterior registrada por uma pessoa da Aviva.

## 7. Segurança e GDPR

- O consentimento deve explicar que nome, idade e telefone opcional dos integrantes serão usados para organizar o acolhimento familiar e apresentar ministérios adequados ao contato principal.
- Telefone de adolescente não equivale a autorização de contato.
- Toda linha deve herdar o vínculo com a prova de consentimento do cadastro principal, sem fingir consentimento individual do integrante.
- A futura autorização de contato direto ao adolescente será registro separado, específico, datado e revogável.
- Observações livres não serão repassadas ao futuro agente.
- Exportação de emergência em texto puro será reavaliada antes da produção.

## 8. Interface e identidade visual

A implementação preservará a identidade existente: faixa sépia-preta, assinatura Aviva, Cinzel/Marcellus, papel envelhecido e alvos de toque grandes. O novo bloco deve continuar leve para o MacBook Air 2011, sem framework, efeitos pesados ou dependências externas.

A classificação ministerial ficará no final da ficha, com três botões grandes, claros e mutuamente exclusivos. O resumo de confirmação mostrará a casa completa antes de cadastrar.

## 9. Erros e mensagens

- Idade de integrante 15+ → “Esta pessoa precisa de um cadastro próprio.”
- Adolescente com telefone → aviso “Telefone registrado; envio automático bloqueado até autorização do responsável.”
- Falha parcial no servidor → registro permanece na fila e o servidor completa a casa no reenvio.
- Token revogado → um único código canônico entre contrato, backend e frontend, com alerta visível.
- Campo fechado inválido → servidor recusa sem gravar nenhuma linha nova.

## 10. Verificação obrigatória

1. Principal sem integrantes.
2. Principal com criança.
3. Principal com adolescente sem telefone.
4. Principal com adolescente com telefone e bloqueio de envio.
5. Tentativa de incluir integrante de 15+ recusada e orientada para cadastro próprio.
6. Jovem solteiro em cadastro próprio.
7. Jovem casado em cadastro próprio.
8. Casado em cadastro próprio.
9. Família gravada em linhas consecutivas com o mesmo `id_familia`.
10. Falha entre linhas + reenvio completa a casa sem duplicação ou perda.
11. Fluxo offline → reconexão → planilha no MacBook real.
12. Confirmação de que nenhum telefone de adolescente chega à futura fila do agente.

## 11. Fora de escopo desta fase

- envio real pelo WhatsApp Business;
- modelos finais das mensagens;
- conversa pastoral para distinguir situações não registradas;
- autorização posterior para contato direto de adolescentes;
- inclusão automática em grupos;
- decisões automáticas do agente sobre estado civil ou classificação ministerial.
