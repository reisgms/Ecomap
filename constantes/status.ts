export const coresPorTipo: Record<string, string> = {
  "Orgânico": "#8B4513",
  "Reciclável": "#4CAF50",
  "Madeira": "#A0522D",
  "Ferro": "#808080",
  "Móveis": "#FFD700",
  "Eletrodomésticos": "#1E90FF"
};

export const statusConfig: Record<string, { cor: string; icone: any }> = {
  "Pendente":   { cor: "#FF6B35", icone: "hourglass-empty" },
  "Em Coleta":  { cor: "#1E90FF", icone: "directions-run"  },
  "Resolvido":  { cor: "#4CAF50", icone: "check-circle"    },
};
