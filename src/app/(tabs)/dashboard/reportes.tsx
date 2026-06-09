import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ReportCard } from "../../../components/modal components/reportCards";
import { db } from "../../../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { reportesStyles } from "../../../styles/reportesStyles";

const filtros = ["Todos", "Pendente", "Em Coleta", "Resolvido"];

export default function Reportes() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reportes"), (snapshot) => {
      const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReportes(dados);
    });
    return () => unsubscribe();
  }, []);

  const reportesFiltrados = filtroAtivo === "Todos"
    ? reportes
    : reportes.filter(r => r.status === filtroAtivo);

  return (
    <View style={reportesStyles.container}>
      {/* Tabs de filtro */}
      <View style={reportesStyles.tabs}>
        {filtros.map(f => (
          <TouchableOpacity
            key={f}
            style={[
              reportesStyles.tab,
              filtroAtivo === f && reportesStyles.tabAtivo
            ]}
            onPress={() => setFiltroAtivo(f)}
          >
            <Text style={reportesStyles.tabText}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de cards */}
      <FlatList
        data={reportesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReportCard
            id={item.id}
            descricao={item.descricao}
            tipos={item.tipos}
            imagem={item.imagem}
            timestamp={item.timestamp}
            localizacao={item.localizacao}
            status={item.status || "Pendente"}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
