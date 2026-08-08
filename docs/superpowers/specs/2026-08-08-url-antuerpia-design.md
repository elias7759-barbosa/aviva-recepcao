# URL dedicada e travada para Antuérpia

**Data:** 08/08/2026  
**Estado:** aprovado pelo Pastor Elias para implementação

## Objetivo

Manter um único Terminal Bem-Vindos e oferecer dois acessos operacionais:

- a URL principal atende Bruxelas e Namur, com troca deliberada entre as duas sedes;
- a URL `/antuerpia/` atende somente Antuérpia e não oferece troca de sede.

## Arquitetura

Não haverá uma segunda cópia da ficha. A entrada `/antuerpia/` encaminhará para a mesma aplicação com um modo explícito de terminal Antuérpia. Assim, layout, validações, fila offline, consentimento e correções futuras permanecem em um único código.

O modo de operação será determinado pela URL antes de a tela principal ser iniciada:

- modo padrão: sedes permitidas `bruxelas` e `namur`;
- modo Antuérpia: sede efetiva e única `antuerpia`.

## Comportamento da URL principal

- O selo superior mostra a sede atual.
- Ao clicar no selo, o operador pode escolher apenas Bruxelas ou Namur.
- A troca exige digitar o nome da nova sede e confirmar.
- A escolha fica armazenada localmente no navegador.
- Cada cadastro leva a sede efetiva no payload e vai para a aba correspondente.

## Comportamento da URL de Antuérpia

- A página abre diretamente como Antuérpia.
- O selo superior mostra `ANTUÉRPIA` e não abre o seletor de sede.
- A seção de troca de sede não aparece nas configurações.
- O modo da URL prevalece sobre qualquer sede anteriormente salva no navegador.
- Todo cadastro leva `sede: antuerpia` e vai somente para `recepcao_antuerpia`.
- A engrenagem permanece disponível para reativação técnica do aparelho.

## Segurança operacional

- Nenhuma URL contém endpoint, token, senha ou identificação do aparelho.
- A URL de Antuérpia não altera nem depende da escolha armazenada para Bruxelas/Namur.
- Abrir a URL principal depois da URL de Antuérpia recupera a última escolha válida entre Bruxelas e Namur.
- A mudança de sede não envia cadastro e não altera dados já gravados.

## Compatibilidade e funcionamento offline

A implementação continuará sem framework, sem CDN e compatível com Chrome antigo/macOS High Sierra. O arquivo de entrada de Antuérpia será mínimo; a aplicação e os recursos necessários continuarão disponíveis no mesmo pacote offline.

## Testes de aceitação

1. Na URL principal, o seletor oferece exatamente Bruxelas e Namur.
2. Bruxelas → Namur muda o selo e as comunas para Namur.
3. Namur → Bruxelas muda o selo e as comunas para Bruxelas.
4. A URL `/antuerpia/` mostra Antuérpia desde a abertura.
5. Na URL de Antuérpia, o selo não abre troca de sede.
6. Nas configurações de Antuérpia, a troca de sede não aparece.
7. O payload montado em Antuérpia contém `sede: antuerpia`.
8. Nenhum teste transmite cadastro real.
9. Os testes existentes de família, consentimento, fila offline e backend continuam passando.

## Publicação

A publicação só ocorrerá depois dos testes locais e da conferência visual. O endereço público esperado será a URL atual acrescida de `/antuerpia/`. A URL exata será confirmada após a publicação no GitHub Pages.
