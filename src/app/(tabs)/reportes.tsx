import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../../contexts/authContext";
import { useReportes } from "@/hooks/useReports";
import { ReportCard } from "../../components/modal components/reportCards";
import { reportesStyles } from "../../styles/reportesStyles";
import { Reporte } from "../../../types/reports";

const filtros = ["Todos", "Pendente", "Em Coleta", "Resolvido"];

export default function Reportes() {
    const { usuario } = useAuth();
    const { reportes, handleConfirmarColeta, handleCancelarColeta } = useReportes(usuario, false, true);
    const [filtroAtivo, setFiltroAtivo] = useState("Todos");

    const reportesFiltrados: Reporte[] = filtroAtivo === "Todos"
        ? reportes
        : reportes.filter(r => r.status === filtroAtivo);

    async function onConfirmar(id: string) {
        Alert.alert(
            'Confirmar coleta',
            'A coleta foi realizada?',
            [
                { text: 'Não', style: 'cancel' },
                {
                    text: 'Sim', onPress: async () => {
                        await handleConfirmarColeta(id);
                        Alert.alert('✅ Confirmado!', 'O reporte foi marcado como resolvido.');
                    }
                },
            ]
        );
    }

    async function onCancelar(id: string) {
        Alert.alert(
            'Cancelar coleta',
            'Deseja cancelar a coleta e recolocar o reporte como Pendente?',
            [
                { text: 'Não', style: 'cancel' },
                {
                    text: 'Sim', onPress: async () => {
                        await handleCancelarColeta(id);
                        Alert.alert('Coleta cancelada', 'O reporte voltou para Pendente.');
                    }
                },
            ]
        );
    }

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
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
                        Nenhum reporte encontrado.
                    </Text>
                }
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
                        isDono={true}
                        onConfirmar={() => onConfirmar(item.id)}
                        onCancelar={() => onCancelar(item.id)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}
