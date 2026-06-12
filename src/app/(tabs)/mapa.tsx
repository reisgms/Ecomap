import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Image, Modal, Platform } from 'react-native';
import { useState } from 'react';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/authContext';
import { useLocation } from '../../../hooks/useLocation';
import { useReportes } from '../../../hooks/useReports';
import { CustomModal } from '../../components/modal components/modal';
import { coresPorTipo, statusConfig } from '../../../constantes/status';
import { Reporte } from '../../../types/reports';
import { mapaStyle } from '../../styles/mapaStyles';
import { bottomSheetStyles } from '../../styles/mapaBottomSheetStyles';

export default function Mapa() {
    const { usuario } = useAuth();
    const location = useLocation();
    const { reportes, handleColetar, handleConfirmarColeta } = useReportes(usuario, true);

    const [modalCriarVisible, setModalCriarVisible] = useState(false);
    const [reporteSelecionado, setReporteSelecionado] = useState<Reporte | null>(null);

    function handlePinPress(reporte: Reporte) {
        setReporteSelecionado(reporte);
    }

    function fecharDetalhes() {
        setReporteSelecionado(null);
    }

    async function onColetar(id: string) {
        await handleColetar(id);
        Alert.alert('✅ Coleta registrada!', 'O dono do reporte foi notificado.');
        fecharDetalhes();
    }

    async function onConfirmar(id: string) {
        await handleConfirmarColeta(id);
        Alert.alert('✅ Coleta confirmada!', 'O reporte foi marcado como resolvido.');
        fecharDetalhes();
    }

    if (!location) {
        return (
            <View style={mapaStyle.container}>
                <Text>Carregando Mapa...</Text>
            </View>
        );
    }

    const markers = reportes.map((reporte) => ({
        id: reporte.id,
        coordinates: {
            latitude: reporte.localizacao.latitude,
            longitude: reporte.localizacao.longitude,
        },
        tintColor: coresPorTipo[reporte.tipos?.[0]] || '#000000',
        onPress: () => handlePinPress(reporte),
    }));

    const mapaProps = {
        style: mapaStyle.mapa,
        cameraPosition: {
            coordinates: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            zoom: 15,
        },
        markers,
        showsUserLocation: true,
    };

    return (
        <View style={mapaStyle.container}>

            {Platform.OS === 'ios'
                ? (
                    <AppleMaps.View
                        {...mapaProps}
                    />
                ) : (
                    <GoogleMaps.View
                        {...mapaProps}
                    />
                )
            }

            {/* Legenda */}
            <View style={mapaStyle.legenda}>
                {Object.entries(coresPorTipo).map(([tipo, cor]) => (
                    <View key={tipo} style={mapaStyle.legendaItem}>
                        <View style={[mapaStyle.legendaCircle, { backgroundColor: cor }]} />
                        <Text style={mapaStyle.legendaText}>{tipo}</Text>
                    </View>
                ))}
            </View>

            {/* Botão criar reporte */}
            <View style={mapaStyle.viewBotao}>
                <TouchableOpacity style={mapaStyle.botao} onPress={() => setModalCriarVisible(true)}>
                    <Text style={mapaStyle.botaoTexto}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Modal criar reporte */}
            <CustomModal visible={modalCriarVisible} onClose={() => setModalCriarVisible(false)} />

            {/* Bottom sheet detalhes do reporte */}
            {reporteSelecionado && (
                <Modal
                    visible={!!reporteSelecionado}
                    transparent
                    animationType="slide"
                    onRequestClose={fecharDetalhes}
                >
                    <TouchableOpacity
                        style={bottomSheetStyles.overlay}
                        activeOpacity={1}
                        onPress={fecharDetalhes}
                    />

                    <View style={bottomSheetStyles.bottomSheet}>
                        <View style={bottomSheetStyles.handle} />

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Header */}
                            <View style={bottomSheetStyles.header}>
                                <Text style={bottomSheetStyles.titulo}>
                                    Reporte #{reporteSelecionado.id.slice(0, 6)}
                                </Text>
                                <View style={[
                                    bottomSheetStyles.badge,
                                    { backgroundColor: statusConfig[reporteSelecionado.status]?.cor }
                                ]}>
                                    <MaterialIcons
                                        name={statusConfig[reporteSelecionado.status]?.icone}
                                        size={12}
                                        color="white"
                                    />
                                    <Text style={bottomSheetStyles.badgeTexto}>{reporteSelecionado.status}</Text>
                                </View>
                            </View>

                            {/* Imagem */}
                            {reporteSelecionado.imagem && (
                                <Image
                                    source={{ uri: reporteSelecionado.imagem }}
                                    style={bottomSheetStyles.imagem}
                                />
                            )}

                            {/* Tipos */}
                            <View style={bottomSheetStyles.tiposRow}>
                                {reporteSelecionado.tipos.map(tipo => (
                                    <View
                                        key={tipo}
                                        style={[bottomSheetStyles.tipoBadge, { backgroundColor: coresPorTipo[tipo] ?? '#aaa' }]}
                                    >
                                        <Text style={bottomSheetStyles.tipoTexto}>{tipo}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Infos */}
                            <View style={bottomSheetStyles.infoRow}>
                                <MaterialIcons name="person" size={16} color="#666" />
                                <Text style={bottomSheetStyles.infoTexto}>
                                    Criado por: {reporteSelecionado.donoNome}
                                </Text>
                            </View>

                            {reporteSelecionado.coletorNome && (
                                <View style={bottomSheetStyles.infoRow}>
                                    <MaterialIcons name="directions-run" size={16} color="#1E90FF" />
                                    <Text style={bottomSheetStyles.infoTexto}>
                                        Coletor: {reporteSelecionado.coletorNome}
                                    </Text>
                                </View>
                            )}

                            {reporteSelecionado.descricao ? (
                                <View style={bottomSheetStyles.infoRow}>
                                    <MaterialIcons name="description" size={16} color="#666" />
                                    <Text style={bottomSheetStyles.infoTexto}>{reporteSelecionado.descricao}</Text>
                                </View>
                            ) : null}

                            <View style={bottomSheetStyles.infoRow}>
                                <MaterialIcons name="event" size={16} color="#666" />
                                <Text style={bottomSheetStyles.infoTexto}>
                                    {new Date(reporteSelecionado.timestamp).toLocaleString()}
                                </Text>
                            </View>

                            {/* Botões de ação */}
                            <View style={bottomSheetStyles.botoesRow}>
                                {reporteSelecionado.donoId !== usuario?.uid
                                    && reporteSelecionado.status === 'Pendente' && (
                                    <TouchableOpacity
                                        style={[bottomSheetStyles.botaoAcao, { backgroundColor: '#4CAF50' }]}
                                        onPress={() => Alert.alert(
                                            'Confirmar coleta',
                                            'Deseja se comprometer a coletar este reporte?',
                                            [
                                                { text: 'Cancelar', style: 'cancel' },
                                                { text: 'Sim', onPress: () => onColetar(reporteSelecionado.id) },
                                            ]
                                        )}
                                    >
                                        <MaterialIcons name="delete" size={18} color="white" />
                                        <Text style={bottomSheetStyles.botaoAcaoTexto}>Coletar</Text>
                                    </TouchableOpacity>
                                )}

                                {reporteSelecionado.donoId === usuario?.uid
                                    && reporteSelecionado.status === 'Em Coleta' && (
                                    <TouchableOpacity
                                        style={[bottomSheetStyles.botaoAcao, { backgroundColor: '#1E90FF' }]}
                                        onPress={() => Alert.alert(
                                            'Confirmar',
                                            'A coleta foi realizada?',
                                            [
                                                { text: 'Cancelar', style: 'cancel' },
                                                { text: 'Sim', onPress: () => onConfirmar(reporteSelecionado.id) },
                                            ]
                                        )}
                                    >
                                        <MaterialIcons name="check-circle" size={18} color="white" />
                                        <Text style={bottomSheetStyles.botaoAcaoTexto}>Confirmar Coleta</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[bottomSheetStyles.botaoAcao, { backgroundColor: '#ccc' }]}
                                    onPress={fecharDetalhes}
                                >
                                    <Text style={[bottomSheetStyles.botaoAcaoTexto, { color: '#333' }]}>Fechar</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </Modal>
            )}
        </View>
    );
}

