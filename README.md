# Terminal de Recepção "Bem-vindos" — Aviva Church

Página para cadastrar visitantes na recepção de cada sede, feita para abrir
em **qualquer aparelho** (iPad, celular, o Mac da recepção) por um único
endereço na internet. **Não é o site avivachurch.be** — é uma página à parte,
publicada no GitHub Pages.

## O que é / o que não é

- Um único arquivo `index.html` (HTML+CSS+JS embutidos, com fontes e imagens
  de marca também embutidas em base64), mais um arquivo de dados ao lado:
  `comunas-por-sede.data.js`/`comunas-por-sede.json` (listas de comuna,
  públicas, sem nada sensível).
- **Publicado no GitHub Pages (07/ago/2026)** — um único endereço na
  internet, aberto em HTTPS de qualquer aparelho (iPad, celular, notebook),
  sem precisar copiar pasta para cada máquina. Continua funcionando também
  local, no Mac, via `abrir-recepcao-bem-vindos.command` (ver "Modo de
  contingência local" abaixo).
- Escrito para rodar até num **MacBook Air 11" Mid 2011, macOS High Sierra
  10.13.6, 4 GB RAM**, no Chrome mais antigo que ainda exista por aí — por
  isso não usa framework, build, CDN externo, nem sintaxe moderna demais
  (sem `?.`, `??`, `:has()`, `backdrop-filter`, etc.).
- **Sem ativação, o terminal não cadastra.** A primeira tela pede a sede
  **e** os dados de ativação (endereço do banco de dados + código do
  aparelho) — sem os dois, ele não libera a tela de cadastro. Isso evita
  acumular uma fila que nunca teria pra onde ir.
- **Não existe nenhuma tela para ver quem já se cadastrou.** Isso é
  proposital (exigência do Calvino, reafirmada no
  `recepcao-CONTRATO-DE-DADOS.md` §8.0/§8 item 5): a página não faz `GET`
  em lugar nenhum. A única lista visível é a fila local de pendentes (quem
  ainda não foi enviado), para permitir desfazer um cadastro errado.

## Segredo NENHUM em arquivo (07/ago/2026)

Este repositório é **publicado publicamente** (GitHub Pages) — por isso ele
**não pode conter, em arquivo nenhum** (código, exemplo, README, script):
URL do banco de dados nem código/token de aparelho. Não existe mais
`config.local.js`/`config.example.js` — foram removidos de propósito.
Endereço e código são digitados **na própria tela**, uma vez por aparelho, e
ficam **cifrados** (AES-GCM, mesma proteção da fila — ver "Segurança da fila
local" mais abaixo) só no navegador de quem ativou. Se algum dia alguém
precisar citar um exemplo de URL neste README, o marcador é sempre
`COLE-AQUI-A-URL-DO-APPS-SCRIPT` — nunca uma URL real, nem de teste.

## Como usar (para quem vai operar a recepção — sem termo técnico)

1. Abra o endereço do terminal no navegador do aparelho (link enviado pelo
   Wesley/Agostinho — funciona em iPad, celular, notebook).
2. Escolha a **sede** e digite o nome dela para confirmar.
3. Cole o **endereço do banco de dados** e o **código deste aparelho** — os
   dois foram te passados junto com o link. Cole com cuidado, sem espaço a
   mais.
4. Toque em "Confirmar e começar a usar". Pronto — o aparelho fica ativado
   permanentemente até alguém trocar deliberadamente (⚙ → "Reativar este
   aparelho" ou "Trocar a sede").

Se o servidor recusar o código ("aparelho não autorizado"), nenhum cadastro
já feito se perde — ele fica esperando na fila, cifrado, até alguém corrigir
o código em Configurações (⚙).

## Modo de contingência local (Mac da recepção)

`abrir-recepcao-bem-vindos.command` continua na pasta e **ainda faz
sentido**, mesmo com o GitHub Pages no ar: ele serve a cópia local do
terminal via `http://localhost` no próprio Mac. Serve para o dia em que a
internet da sede cair **antes** de o navegador ter conseguido carregar a
página do GitHub Pages pela primeira vez — sem internet nenhuma, um endereço
da internet não abre, mas um arquivo local + servidor local abrem sempre. A
sincronização com o banco de dados continua exigindo internet de qualquer
forma (isso é do desenho, não muda); o que este atalho garante é que o
**cadastro em si** (guardado cifrado, na fila) não fica refém da rede cair
bem na hora do culto.

- Dê dois cliques em `abrir-recepcao-bem-vindos.command` (mesma pasta do
  `index.html`). Ele sobe um servidor HTTP local sozinho e abre
  `http://localhost:8080/` no Chrome. Deixe a janela do Terminal que abrir
  junto minimizada; fechá-la desliga o servidor.
- Se o `.command` perder a permissão de execução na cópia (comum em
  pendrive/AirDrop), rode uma vez: `chmod +x abrir-recepcao-bem-vindos.command`.
- Duplo clique direto em `index.html` (`file://`) **também funciona** neste
  Chrome — testado e confirmado (ver nota "acesso `file://`" mais abaixo) —
  mas o atalho é preferível por não depender do caminho exato do arquivo no
  disco (o que poderia deixar uma fila presa numa "origem" antiga se o
  arquivo for movido/renomeado).
- Se quiser subir o servidor manualmente:
  `cd recepcao-bem-vindos && python3 -m http.server 8080` (ou, no Python 2.7
  de fábrica do High Sierra, `python -m SimpleHTTPServer 8080`) e abrir
  `http://localhost:8080/`.
- A sede e a ativação configuradas no uso local ficam **só neste
  navegador/Mac** — não têm relação com a ativação de nenhum outro
  aparelho que abra o endereço do GitHub Pages (cada navegador guarda a
  sua, cifrada, separadamente).

O transporte com o backend usa `Content-Type: text/plain;charset=utf-8`
(recomendação do contrato §1, evita o preflight CORS que quebra em Apps
Script Web Apps) com o corpo sendo a string JSON do payload; a fila local
tenta se sincronizar sozinha a cada ~45s e sempre que o aparelho voltar a
ficar online.

## Fluxo da tela (recepcionista)

1. **Selo da sede** sempre visível no topo, com a assinatura AVIVA CHURCH
   (lampião no lugar do "I") e o lema "Reformada na doutrina e Carismática
   no Espírito" na faixa escura.
2. **Consentimento primeiro**, em duas ações separadas (nunca uma caixa só,
   são atos jurídicos diferentes): declaração de maioridade + consentimento
   de dados. As duas vêm desmarcadas; o formulário fica travado até ambas
   serem marcadas.
3. Preenche nome, telefone (código de país livre — ver seção própria
   abaixo), e-mail (opcional), se é a primeira visita, categoria, comuna de
   residência (lista oficial da sede + "Outra") e idioma. Em "Mais
   informações (opcional)": como conheceu a igreja, convidado por, quem
   atendeu, observações.
4. Toca em "Revisar e cadastrar" → aparece a tela **"Cadastrar em
   \<SEDE\> — confirma?"** com o resumo.
5. Confirma → grava na hora, localmente, com um UUID próprio
   (`id_cliente_uuid`), e mostra **"Guardado neste aparelho — aguardando
   envio"**. Nunca aparece a palavra "enviado" nesse momento — só depois
   que o servidor de fato confirmar o recebimento (`{ok:true,
id_registro:"..."}`, toast verde separado, "enviado à igreja").
6. O contador "N aguardando envio" no topo é sempre visível e nunca mente.

## Telefone internacional (Frente 3, 06/ago/2026)

A congregação tem gente com número do Brasil, Portugal, Angola, Moçambique,
Luxemburgo e Bélgica — o campo de telefone é **livre para o mundo todo**,
não só BE/LU:

- Campo único, pré-preenchido com `+32` (mais comum), totalmente editável.
- Uma bandeira aparece sozinha conforme a pessoa digita o código do país
  (`+55` → 🇧🇷, `+351` → 🇵🇹 etc.) — calculada por fórmula a partir do ISO2
  (regional indicator symbols), não é uma lista de emojis digitada à mão.
- Atalhos de um toque para os países mais comuns da congregação: 🇧🇪 +32 ·
  🇧🇷 +55 · 🇵🇹 +351 · 🇱🇺 +352 · 🇦🇴 +244 · 🇲🇿 +258 · 🇫🇷 +33 · 🇳🇱 +31.
- Tabela de ~200 códigos de discagem embutida no JS (`CONFIG.CODIGOS_PAIS`),
  sem biblioteca externa (nada de libphonenumber/CDN).
- **Código fora da tabela nunca bloqueia o cadastro** — mostra 🌐 e uma
  mensagem tranquilizadora, mas segue liberado para enviar.
- **Validação client-side é só de "campo preenchido"**, não de formato.
  Isso é deliberado: o contrato do Agostinho (`recepcao-CONTRATO-DE-DADOS.md`
  §2/§3) trata `telefone_e164` malformado como "melhor esforço, não
  bloqueia" — o servidor sinaliza (`telefone_valido=A_CONFERIR`) em vez de
  recusar. Testado ao vivo: um número com código inventado (`+888...`)
  ainda libera o botão "Revisar e cadastrar".

## Fila / pendentes

- Botão "🕓 N aguardando envio" abre a fila local. Cada item ainda não
  enviado pode ser **desfeito** ali mesmo (some do aparelho, nunca chegou
  a sair).
- "Exportar pendentes" baixa um `.txt` com tudo o que ainda está na fila
  — para usar antes de o aparelho morrer, ficar sem bateria, etc. Se o
  download automático falhar (navegador antigo), abre uma caixa de texto
  para copiar manualmente.
- Assim que um registro é confirmado pelo servidor (`ok:true`), ele
  **some da fila local** — só o contador total de enviados incrementa, sem
  guardar uma lista de quem já foi enviado no aparelho.
- Se o servidor recusar (`ok:false`, ex. `CONSENTIMENTO_AUSENTE` — não
  deveria acontecer, já que a própria tela bloqueia antes), o registro
  **continua na fila** e o motivo vai pro console, nunca é descartado
  silenciosamente.

## Trocar a sede de um aparelho emprestado

No ícone de engrenagem (⚙) → "Trocar a sede deste aparelho" → escolher a
nova sede no menu **e digitar o nome dela** (com acento, ex. "Antuérpia")
para confirmar. Não existe troca por um único clique — é proposital, para
não trocar sede sem querer. O mesmo painel mostra o `dispositivo_id` fixo
deste aparelho.

## Reativar um aparelho (código revogado, endereço mudou)

No ícone de engrenagem (⚙) → "Reativar este aparelho (trocar
endereço/código)" → colar o novo endereço e o novo código **e digitar a
palavra TROCAR** para confirmar. Mesma lógica de proteção deliberada da
troca de sede — não é um clique solto. Cadastros já guardados na fila **não
são apagados** por essa ação.

## Identidade visual (Frente 2, 06/ago/2026)

Aplicada com os ativos oficiais existentes — nada gerado/desenhado por este
agente:

- **Assinatura** `marca-aviva/assinatura/assinatura-marcellus-escuro.png`
  (dourada/creme, feita para fundo escuro) na faixa escura do topo e na
  tela de configuração inicial — nunca sobre o marfim claro.
- **Lampião** `marca-aviva/logo-lampiao-padrao/lampiao-preto.png` como
  marca d'água a 5% de opacidade no canto da tela principal — imagem
  estática única, sem filtro/blur/parallax, custo de GPU mínimo mesmo na
  Intel HD 3000 de 2011.
- **Paleta oficial** de `marca-aviva/PALETA.md` (24/jul/2026): sépia-preto
  `#14110B` como base, marfim `#F0E6D2` de fundo, vermelhão `#A8341E` só em
  erro/alerta (tempero, não base), ouro `#E7BD3D` e âmbar `#E8C890` como
  luz (lema, badge, destaques). Bronze `#8C5A16` para texto secundário e
  botão primário. Nenhuma cor inventada — bordas/fundos de aviso são tons
  derivados (alpha) dessas mesmas cores oficiais.
- **Tipografia**: Cinzel-Black para o selo da sede e os títulos (medieval-
  clássica, legível de relance com fila na frente); Marcellus-Regular para
  o lema "Reformada na doutrina e Carismática no Espírito". Nenhum
  blackletter (UnifrakturCook/Maguntia) usado — deliberado, para manter
  legibilidade máxima num rótulo operacional (a skill de design bane
  blackletter >5 palavras e o próprio Pastor pediu "gótica, mas que dê
  para ler").
- Fontes e imagens **embutidas em base64 dentro do `index.html`** (arquivo
  final ~0,4 MB, bem abaixo do teto de 2 MB) — obrigatório porque o Chrome
  bloqueia `@font-face`/`fetch` de arquivo externo quando a página abre
  via `file://`.

### Correção 06/ago/2026 (2ª rodada) — assinatura maior + contraste dos campos

O Pastor viu a tela e pediu dois ajustes, com números medidos (não "olho"):

1. **Assinatura maior.** Ela dividia espaço com o selo da sede e o
   contador na mesma linha e saía minúscula (46px de altura, "CHURCH"
   ilegível). Agora tem **linha própria**, centralizada, abaixo do selo/
   contador — `width: clamp(200px, 30vw, 320px)` (altura proporcional,
   ~120–192px conforme a tela, 3×–4× o tamanho antigo). Testado em janela
   estreita (~460px): selo e contador continuam numa linha só sem
   sobrepor, a assinatura ganha linha própria abaixo, sem quebrar feio.
2. **Contraste dos campos.** Medido com a fórmula de luminância relativa
   do WCAG:

   | Par                                        | Antes                     | Depois                          |
   | ------------------------------------------ | ------------------------- | ------------------------------- |
   | Fundo do campo (`#FFF`) vs fundo da página | **1.24:1** (`#F0E6D2`)    | **2.09:1** (`#C9B084`)          |
   | Borda do campo vs fundo da página          | ~1.9:1 (bronze 35% alpha) | **9.00:1** (sépia-preto sólido) |
   | Borda do campo vs campo branco             | —                         | **18.84:1**                     |
   | Rótulo do campo vs fundo da página         | 4.72:1 (bronze)           | **8.99:1** (sépia-preto)        |

   Como: **só o fundo da página escureceu/saturou** (`--cor-fundo: #C9B084`,
   um marfim mais denso — mesma família, não é cor nova); o campo continua
   branco puro (não tinha para onde clarear). Toda borda de campo trocou de
   bronze translúcido para **sépia-preto sólido** (`--cor-borda-forte`), e
   o foco usa outline sépia-preto de 3px. Um `<select>` da tela de
   configurações (troca de sede) estava **fora** de qualquer classe
   `.field`/`.setup-card` e por isso escapava com a borda cinza padrão do
   navegador — corrigido criando uma **regra universal única** para todo
   `input[type=text/tel/email]`, `select` e `textarea` do app (não é mais
   possível um campo "escapar", não importa onde ele esteja no HTML).
   Confirmado por `getComputedStyle` no Chrome, não só no CSS-fonte.

   O lampião de marca d'água **não foi tocado** (aprovado pelo Pastor) —
   segue com a mesma opacidade de 5%, mesma posição, mesmo asset.

## Nomes de campo / contrato de dados (Frente 1, 06/ago/2026)

O payload enviado ao Apps Script (quando `ENDPOINT_URL` existir) está
**casado 1:1** com
`ecossistema-ministerial/recepcao-CONTRATO-DE-DADOS.md` (Agostinho,
06/ago/2026) — os nomes de campo ficam todos juntos em `CONFIG.FIELDS`, no
topo do `<script>` do `index.html`. Campos automáticos que o terminal
preenche sozinho (não vêm de tela nenhuma):

| Campo                                            | Como é preenchido                                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `sede`                                           | travado no aparelho (tela de configuração)                                                |
| `acao`                                           | sempre `REGISTRO` — este terminal não tem UI de correção/anulação (fora do escopo pedido) |
| `id_registro_referenciado`                       | sempre vazio (seguindo o acima)                                                           |
| `carimbo_cliente`                                | timestamp no instante do "Confirmar cadastro", nunca do reenvio                           |
| `dispositivo_id`                                 | gerado e fixado sozinho na primeira vez, visível em Configurações (⚙)                     |
| `enviado_via`                                    | `ONLINE`/`FILA_OFFLINE` conforme `navigator.onLine` no instante do cadastro, congelado    |
| `id_cliente_uuid`                                | UUID v4 gerado no aparelho — chave de idempotência do servidor                            |
| `declaracao_maioridade` / `consentimento_aceite` | `SIM` (única forma de o formulário liberar o envio)                                       |
| `consentimento_versao_exibida`                   | `PT-v4-2026-08`                                                                           |

Se o contrato mudar de novo, o único lugar a tocar é o objeto
`CONFIG.FIELDS`/`CONFIG.CONSENT` no topo do JS.

### Comunas por sede — dado consumido por script, não copiado à mão

`comunas-por-sede.data.js` é gerado a partir de
`ecossistema-ministerial/comunas-por-sede.json` pelo script
`atualizar-comunas.sh` (chama um `python3` embutido) — nunca retranscrito
manualmente. Quando o Agostinho atualizar a lista oficial:

```
cd recepcao-bem-vindos
./atualizar-comunas.sh
```

Isso reescreve `comunas-por-sede.data.js` (e atualiza a cópia crua
`comunas-por-sede.json`) nesta pasta. Revise o diff e reinstale nos
aparelhos. `Luxemburgo` está com lista vazia no arquivo oficial (célula sem
terminal físico ainda) — a tela mostra só "Outra" nesse caso, sem quebrar.

## Texto de consentimento

Versão **`PT-v4-2026-08`** de
`ecossistema-ministerial/texto-consentimento.md` (Agostinho, 07/ago/2026,
com BCE `0887 664 321` e endereço do Kinepolis já confirmados pelo Pastor)
— citado tal como escrito, sem resumo nem reescrita. O terminal mostra as
**duas ações completas exigidas para o canal "terminal de recepção"**
(§1): declaração de maioridade + consentimento de dados, cada uma com sua
própria caixa, mais o bloco de identificação do responsável pelo
tratamento (Aviva Church ASBL, endereço, canal `avivachurch.infra@gmail.com`).

**Correção 07/ago/2026 (2 frases, pedido do Pastor):**

1. A Ação 2 (consentimento de dados) listava por engano **"quem me
   convidou"** entre os dados coletados — esse campo (`convidado_por`)
   saiu do cadastro em 06/ago/2026 e nunca deveria ter ficado no texto.
   Corrigido para o dado real coletado: "o nome e a idade de quem veio
   comigo" (cobre "Membros da Família"). Por ser mudança no que a pessoa
   efetivamente lê e aceita, a versão subiu de `PT-v2` para `PT-v3`.
2. A ajuda da Ação 1 (maioridade) dizia "Menores de 18 ainda não são
   cadastrados por este terminal" logo acima do campo **Membros da
   Família**, onde se cadastra idade de criança/adolescente — parecia se
   contradizer. Reescrita para deixar claro que quem _preenche_ a ficha é
   o adulto: "Quem preenche esta ficha é o adulto. Crianças e adolescentes
   que vieram junto entram em 'Membros da Família', logo abaixo." A caixa
   de marcar em si não foi tocada (ordem direta do Pastor).

Status conforme o próprio documento: "pronto para o passe de voz do
Charles" — falta essa etapa e o parecer final do Calvino antes de operar
com pessoas reais. O terminal já está pronto tecnicamente para essa
versão; o "sim" de produção não é deste agente.

## Segurança da fila local (cifra, decisão do Pastor 07/ago/2026)

> "Ele fica lá offline mas ninguém consegue acessar, e quando ligar na
> internet ele envia pro nosso banco de dados." — Pastor Elias, 07/ago.

A fila de cadastros ainda não enviados **nunca fica em texto puro** no
aparelho:

- **Cifra:** AES-GCM 256 bits, com a chave gerada por `crypto.subtle` como
  **não-extraível** (`extractable: false`) e guardada como `CryptoKey`
  dentro do **IndexedDB** (a própria API sabe serializar um `CryptoKey`
  pelo structured clone — a chave nunca sai como bytes, nem por este
  código nem por quem abrir os arquivos do perfil do Chrome).
- **Ciclo de vida:** com internet, o cadastro é enviado na hora e não fica
  na fila. Sem internet, fica cifrado até a próxima janela online, quando
  é enviado e apagado da fila **no instante** em que o servidor confirma
  (`{ok:true}`). A tela só mostra a **contagem** de pendentes e o mínimo
  para o "Desfazer" (nome/telefone/comuna do próprio item pendente) — não
  existe, e não deve existir, uma lista navegável de todo mundo que já se
  cadastrou (o terminal nunca lê a base — contrato §8.0/§8 item 5).
- **Migração automática:** se um aparelho já tinha fila antiga em
  `localStorage` (texto puro, versões anteriores a 07/ago), ela é lida
  **uma única vez**, migrada para o armazenamento cifrado, e a chave antiga
  em texto puro é apagada — sem perder nenhum registro pendente.

### Ativação do aparelho (endereço + código) usa a MESMA cifra

Desde que o repositório passou a ser publicado (GitHub Pages, 07/ago/2026),
o endereço do banco de dados e o código do aparelho (`terminal_token`) não
podem mais viver em arquivo nenhum — qualquer arquivo aqui é público. Os
dois são digitados na tela (configuração inicial ou ⚙ → "Reativar este
aparelho") e cifrados com o **mesmo mecanismo AES-GCM/chave não-extraível**
da fila, num blob separado dentro do mesmo IndexedDB. Consequência prática:
**sem completar a ativação, o terminal nem mostra a tela de cadastro** — ele
volta para a tela de configuração em vez de deixar a fila crescer sem
destino. Se o servidor responder `TERMINAL_NAO_AUTORIZADO` (código errado ou
revogado), a fila pendente **não é descartada** — o cadastro do visitante
não se perde por causa disso; a tela mostra um aviso e aponta para ⚙ →
"Reativar este aparelho".

### O que a cifra PROTEGE

Bisbilhotar o painel de armazenamento do navegador (Application → IndexedDB
no DevTools, se aberto por _outra_ aba/perfil sem rodar a página), copiar
os arquivos do perfil do Chrome, restaurar um backup do Mac, ou recuperar
dados de um disco removido — em todos esses casos, o que se encontra é
ruído cifrado, não nome/telefone.

### O que a cifra NÃO PROTEGE — dito com todas as letras

**Não protege contra alguém que abra o Console de DevTools NA PRÓPRIA
PÁGINA já carregada** (F12 → Console, na aba onde o terminal está aberto e
rodando) **e chame a função de decifrar diretamente.** Enquanto a página
está rodando, ela tem acesso de _uso_ à chave (é assim que ela mesma cifra
e decifra sozinha) — isso é inerente a qualquer cifra que roda inteiramente
no navegador sem depender de uma senha externa. Fechar esse último
cenário exigiria uma **tela de senha/PIN** protegendo o terminal, que o
Pastor **não pediu** nesta fase (a decisão dele foi especificamente sobre
proteger o que fica em disco, não sobre autenticação de quem usa o
aparelho). Não afirmamos, e não se deve entender, que isto torna o
aparelho inviolável — é uma cifra em repouso (_at rest_), não um cofre com
senha.

**O que fecha esse resto:** manter o **FileVault ligado** neste Mac. Com
FileVault ativo, mesmo que alguém retire o disco fisicamente, o conteúdo
inteiro (incluindo qualquer cache/swap que o sistema operacional tenha
feito da memória) permanece cifrado no nível do disco — cobre o cenário
que a cifra da aplicação, por si só, não cobre.

### Nota sobre `crypto.subtle` e `file://` (achado real, testado, 07/ago/2026)

A Web Crypto API (`crypto.subtle`) só funciona em **contexto seguro**
(HTTPS ou `http://localhost`) — em teoria, abrir `index.html` direto por
duplo clique (`file://`) poderia deixar a cifra indisponível. **Testado
com Playwright/Chromium (o mesmo motor do Chrome instalado neste Mac):**
neste navegador, `file://` **já é tratado como contexto seguro**
(`window.isSecureContext === true`, `crypto.subtle` disponível) — a cifra
funciona normalmente mesmo por duplo clique direto, sem precisar do
atalho. Por isso o terminal tem uma **tela de bloqueio defensiva**
("abra pelo atalho...", ver `index.html`, função
`mostrarTelaModoInseguro`) que só aparece se, por qualquer motivo
(navegador diferente, versão futura, política de segurança do Mac),
`crypto.subtle`/`IndexedDB` não estiverem disponíveis — nesse caso o
terminal **trava com uma instrução clara em vez de guardar qualquer dado
em texto puro como alternativa "menos segura"**. O atalho
`abrir-recepcao-bem-vindos.command` continua sendo a forma recomendada de
abrir o terminal (mais robusto — não depende do caminho exato do arquivo
no disco, que pode mudar a "origem" do `file://` e, com isso, esconder a
fila que ficou presa num caminho antigo), mas não é a única forma que
funciona.

## Limites conhecidos (decisões deliberadas, não bugs)

- Sem login/usuário — qualquer voluntário na recepção pode operar.
- Sem tela de listagem/histórico de cadastrados — por design (contrato
  §8.0, "o terminal nunca lê").
- Sem UI de `CORRECAO`/`ANULACAO` (contrato §8.2) — não foi pedido nesta
  fase; `acao` sai sempre `REGISTRO`. Se for pedido depois, o campo já
  existe no payload, só falta a tela.
- Telefone: validação client-side é só "preenchido", não "bem formatado"
  — decisão deliberada para nunca travar a recepção com uma pessoa na
  frente (ver seção própria acima).
- `categoria_declarada` e `idioma` vêm com um valor padrão pré-selecionado
  (Visitante / Português) para reduzir atrito, mas são editáveis e
  contam como campo obrigatório preenchido desde o início.
- Consentimento em **PT apenas** — o terminal já coleta `idioma` da
  pessoa, mas não há ainda tradução aprovada do texto de consentimento
  para FR/NL/EN (limitação documentada em `banco-google-sheets-ESPEC.md
§8.5`, não esquecimento).
- Ativação **por navegador, não por pessoa** — qualquer aparelho com o
  endereço + código corretos está ativado; não existe usuário/senha
  individual (mesma decisão de "sem login" acima, agora estendida à
  ativação).
- Sem tela de "revogar daqui" — revogar um código é uma ação do lado do
  servidor (Apps Script), fora do escopo deste terminal.

---

— Wesley (webmaster-aviva)
