#!/bin/sh
# Regenera comunas-por-sede.data.js a partir da fonte canônica do Agostinho
# (ecossistema-ministerial/comunas-por-sede.json), sem retranscrever nada à
# mão — é o passo de "republicação" citado em recepcao-CONTRATO-DE-DADOS.md §9.
#
# Uso: rode este script sempre que o Agostinho avisar que atualizou o
# arquivo de comunas. Ele lê a fonte, valida que é JSON bem-formado, e
# reescreve o sidecar comunas-por-sede.data.js (mais uma cópia crua
# comunas-por-sede.json) nesta mesma pasta.

set -e
cd "$(dirname "$0")"

FONTE="$HOME/Documents/Aviva-Claude/ecossistema-ministerial/comunas-por-sede.json"

if [ ! -f "$FONTE" ]; then
  echo "Fonte não encontrada: $FONTE" >&2
  exit 1
fi

cp "$FONTE" ./comunas-por-sede.json

python3 - "$FONTE" <<'EOF'
import json, io, sys

fonte = sys.argv[1]
with io.open(fonte, encoding="utf-8") as f:
    data = json.load(f)

texto = json.dumps(data, ensure_ascii=False, indent=2)

with io.open("comunas-por-sede.data.js", "w", encoding="utf-8") as f:
    f.write("/* Gerado automaticamente a partir de ecossistema-ministerial/comunas-por-sede.json\n")
    f.write("   (script, nao copiado a mao) -- ver README.md para o passo de republicacao\n")
    f.write("   quando o Agostinho atualizar o arquivo fonte. */\n")
    f.write("window.AVIVA_COMUNAS_POR_SEDE = ")
    f.write(texto)
    f.write(";\n")

print("comunas-por-sede.data.js atualizado.")
EOF

echo "Pronto. Revise o diff (git diff ou cmp) antes de reinstalar nos aparelhos."
