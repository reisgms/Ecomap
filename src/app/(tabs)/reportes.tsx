import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ReportCard } from "../../components/modal components/reportCards";
import { reportesStyles } from "../../styles/reportesStyles";
import { useReportes } from "@/hooks/useReports";
import { Reporte } from "../../../types/reports";

const filtros = ["Todos", "Pendente", "Em Coleta", "Resolvido"];

export default function Reportes() {
    const { reportes } = useReportes(null);
    const [filtroAtivo, setFiltroAtivo] = useState("Todos");

    const reportesFiltrados: Reporte[] = filtroAtivo === "Todos"
        ? reportes
        : reportes.filter(r => r.status === filtroAtivo);

    return (
        <View style={reportesStyles.container}>
            <View style={reportesStyles.tabs}>
                {filtros.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[reportesStyles.tab, filtroAtivo === f && reportesStyles.tabAtivo]}
                        onPress={() => setFiltroAtivo(f)}
                    >
                        <Text style={reportesStyles.tabText}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={reportesFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ReportCard
                        id={item.id}
                        descricao={item.descricao}
                        tipos={item.tipos}
                        imagem={item.imagem ?? undefined}
                        timestamp={item.timestamp}
                        localizacao={item.localizacao}
                        status={item.status}
                        donoNome={item.donoNome}
                        coletorNome={item.coletorNome}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}