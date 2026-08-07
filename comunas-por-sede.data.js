/* Gerado automaticamente a partir de ecossistema-ministerial/comunas-por-sede.json
   (script, nao copiado a mao) -- ver README.md para o passo de republicacao
   quando o Agostinho atualizar o arquivo fonte. */
window.AVIVA_COMUNAS_POR_SEDE = {
  _meta: {
    gerado_por: "Agostinho (secretaria-aviva)",
    data: "2026-08-06",
    uso: "Lista fechada para o dropdown `comuna_residencia` do terminal de recepção Bem-vindos (ver banco-google-sheets-ESPEC.md §8.1). Consumir direto por sede.",
    regra:
      "O frontend sempre soma a opção 'Outra' (chave outra_opcao abaixo) ao final de cada lista de sede. Selecionar 'Outra' não bloqueia o envio (o terminal nunca bloqueia por dado de qualidade, só por consentimento/maioridade ausentes, ver ESPEC §8.3).",
    fontes: {
      Bruxelas:
        "As 19 comunas oficiais da Região de Bruxelas-Capital — divisão administrativa estável, fato verificável.",
      Namur:
        "As 16 comunas do arrondissement administratif de Namur (Província de Namur) — divisão administrativa estável, fato verificável.",
      Antuérpia:
        "Os 9 distritos oficiais da cidade de Antuérpia (fusão administrativa de 2001) — fato verificável. NÃO inclui municípios vizinhos independentes (ex.: Mortsel, Edegem, Schoten, Brasschaat, Kontich) porque esses são entidades administrativas separadas, não distritos da cidade — ficam cobertos por 'Outra' até haver dado real de onde os visitantes de fato moram. Revisar esta lista após ~3 meses de uso real do terminal (nota do Agostinho, não decisão automática).",
    },
  },
  Bruxelas: [
    "Anderlecht",
    "Auderghem (Oudergem)",
    "Berchem-Sainte-Agathe (Sint-Agatha-Berchem)",
    "Bruxelles-Ville (Brussel Stad)",
    "Etterbeek",
    "Evere",
    "Forest (Vorst)",
    "Ganshoren",
    "Ixelles (Elsene)",
    "Jette",
    "Koekelberg",
    "Molenbeek-Saint-Jean (Sint-Jans-Molenbeek)",
    "Saint-Gilles (Sint-Gillis)",
    "Saint-Josse-ten-Noode (Sint-Joost-ten-Node)",
    "Schaerbeek (Schaarbeek)",
    "Uccle (Ukkel)",
    "Watermael-Boitsfort (Watermaal-Bosvoorde)",
    "Woluwe-Saint-Lambert (Sint-Lambrechts-Woluwe)",
    "Woluwe-Saint-Pierre (Sint-Pieters-Woluwe)",
  ],
  Namur: [
    "Namur",
    "Andenne",
    "Assesse",
    "Eghezée",
    "Fernelmont",
    "Floreffe",
    "Fosses-la-Ville",
    "Gembloux",
    "Gesves",
    "Jemeppe-sur-Sambre",
    "La Bruyère",
    "Mettet",
    "Ohey",
    "Profondeville",
    "Sambreville",
    "Sombreffe",
  ],
  Antuérpia: [
    "Antwerpen (centro)",
    "Berchem",
    "Berendrecht-Zandvliet-Lillo",
    "Borgerhout",
    "Deurne",
    "Ekeren",
    "Hoboken",
    "Merksem",
    "Wilrijk",
  ],
  Luxemburgo: [],
  outra_opcao: "Outra",
};
