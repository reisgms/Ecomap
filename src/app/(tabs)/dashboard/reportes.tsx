// src/screens/reportes.tsx
import React from "react";
import { ScrollView } from "react-native";
import { ReportCard } from "../../../components/modal components/reportCards";

const mockReports = [
  {
    id: "1",
    title: "Lixo acumulado na rua",
    status: "Pendente",
    description: "Resíduos acumulados próximos à praça central.",
    image: "https://placekitten.com/200/200"
  },
  {
    id: "2",
    title: "Coleta em andamento",
    status: "Em Coleta",
    description: "Equipe já está recolhendo os resíduos.",
    image: "https://placekitten.com/201/200"
  },
  {
    id: "3",
    title: "Área limpa",
    status: "Resolvido",
    description: "Local foi limpo e está em boas condições.",
    image: "https://placekitten.com/202/200"
  }
];

export default function Reportes() {
  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {mockReports.map((report) => (
        <ReportCard
          key={report.id}
          id={report.id}
          title={report.title}
          status= "Em Coleta"
          description={report.description}
          image={report.image}
        />
      ))}
    </ScrollView>
  );
}
