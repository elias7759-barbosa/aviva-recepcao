#!/bin/bash
# =============================================================================
# Aviva Church — Terminal de Recepção "Bem-vindos"
# Atalho de um clique: sobe um servidor HTTP local e abre o Chrome em
# http://localhost — NÃO abrir mais o index.html por duplo clique direto.
#
# POR QUÊ ISSO EXISTE (07/ago/2026): a fila de cadastros pendentes agora é
# cifrada (AES-GCM, Web Crypto API). Essa API só funciona em "contexto
# seguro" (HTTPS ou http://localhost) — em file:// (duplo clique comum) ela
# não existe, e a tela do terminal trava sozinha avisando disso. Este script
# resolve o problema servindo a pasta em http://localhost e abrindo o Chrome
# nela, sem precisar decorar comando nenhum.
#
# COMPATIBILIDADE: este Mac (MacBook Air 11" Mid 2011) roda macOS High
# Sierra 10.13.6, que traz de fábrica Python 2.7 (não Python 3) — o módulo
# certo nesse caso é "SimpleHTTPServer", não "http.server". O script tenta,
# em ordem, o melhor disponível: python3 → php → python (2.7) — o que
# existir de fábrica ou instalado, sem exigir instalar nada de novo.
# =============================================================================

set -e
cd "$(dirname "$0")"

PORTA=8080
URL="http://localhost:$PORTA/"

echo "Aviva Church — Recepção Bem-vindos"
echo "Procurando um servidor HTTP disponível neste Mac..."
echo ""

if command -v python3 >/dev/null 2>&1; then
  echo "Usando python3 (http.server) na porta $PORTA."
  SERVER_BIN="python3"
  SERVER_ARGS=(-m http.server "$PORTA")
elif command -v php >/dev/null 2>&1; then
  echo "Usando php -S na porta $PORTA."
  SERVER_BIN="php"
  SERVER_ARGS=(-S "localhost:$PORTA")
elif command -v python >/dev/null 2>&1; then
  echo "Usando python 2.7 (SimpleHTTPServer) na porta $PORTA — padrão de fábrica do macOS High Sierra."
  SERVER_BIN="python"
  SERVER_ARGS=(-m SimpleHTTPServer "$PORTA")
else
  echo "Nenhum servidor HTTP encontrado neste Mac (testei python3, php e python)."
  echo "Avise o Wesley — sem um destes, o terminal não consegue abrir em"
  echo "http://localhost e a fila cifrada não funciona."
  echo ""
  read -p "Aperte ENTER para fechar esta janela..." _
  exit 1
fi

echo ""
echo "Abrindo $URL no Google Chrome em 2 segundos..."
echo "(Deixe esta janela do Terminal aberta — fechar ela desliga o servidor.)"
echo ""

( sleep 2 && open -a "Google Chrome" "$URL" 2>/dev/null || open "$URL" ) &

exec "$SERVER_BIN" "${SERVER_ARGS[@]}"
