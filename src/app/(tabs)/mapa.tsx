import { MaterialIcons } from '@expo/vector-icons';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useState } from 'react';
import { Alert, Image, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { coresPorTipo, statusConfig } from '../../../constantes/status';
import { useAuth } from '../../../contexts/authContext';
import { useLocation } from '../../../hooks/useLocation';
import { usePermissoesReporte } from '../../../hooks/usePermissioesReporte';
import { useReportes } from '../../../hooks/useReports';
import { Reporte } from '../../../types/reports';
import { CustomModal } from '../../components/modal components/modal';
import { bottomSheetStyles } from '../../styles/mapaBottomSheetStyles';
import { mapaStyle } from '../../styles/mapaStyles';

export default function Mapa() {
    const { usuario } = useAuth();
    const location = useLocation();
    const [modalCriarVisible, setModalCriarVisible] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null);

    const { reportes, handleColetar, handleConfirmarColeta, handleCancelarColeta } = useReportes(usuario, true);

    // Deriva o reporte do array em tempo real — reflete atualizações do Firestore sem fechar o modal
    const reporteSelecionado = idSelecionado ? (reportes.find(r => r.id === idSelecionado) ?? null) : null;

    const { podeColetar, podeConfirmar, podeCancelar } = usePermissoesReporte(reporteSelecionado, usuario?.uid);

    function handleMarkerClick(markerId: string | undefined) {
        if (!markerId) return;
        setIdSelecionado(markerId);
    }

    function fecharDetalhes() {
        setIdSelecionado(null);
    }

    async function onColetar(id: string) {
        try {
            await handleColetar(id);
            Alert.alert('✅ Coleta registrada!', 'O dono do reporte foi notificado.');
            fecharDetalhes();
        } catch (e: any) {
            Alert.alert('Não foi possível coletar', e?.message ?? 'Tente novamente.');
        }
    }

    async function onConfirmar(id: string) {
        await handleConfirmarColeta(id);
        Alert.alert('✅ Coleta confirmada!', 'O reporte foi marcado como resolvido.');
        fecharDetalhes();
    }

    async function onCancelar(id: string) {
        await handleCancelarColeta(id);
        Alert.alert('Coleta cancelada', 'O reporte voltou para Pendente.');
        fecharDetalhes();
    }

    if (!location) {
        return (
            <View style={mapaStyle.container}>
                <Text>Carregando Mapa...</Text>
            </View>
        );
    }

    // Google Maps markers (sem tintColor — não suportado)
    const googleMarkers: GoogleMaps.Marker[] = reportes.map((reporte) => ({
        id: reporte.id,
        coordinates: {
            latitude: reporte.localizacao.latitude,
            longitude: reporte.localizacao.longitude,
        },
        title: reporte.tipos?.[0] ?? 'Reporte',
    }));

    // Apple Maps markers (suporta tintColor)
    const appleMarkers: AppleMaps.Marker[] = reportes.map((reporte) => ({
        id: reporte.id,
        coordinates: {
            latitude: reporte.localizacao.latitude,
            longitude: reporte.localizacao.longitude,
        },
        tintColor: coresPorTipo[reporte.tipos?.[0]] ?? '#FF6B35',
    }));

    const cameraPosition = {
        coordinates: {
            latitude: location.latitude,
            longitude: location.longitude,
        },
        zoom: 15,
    };

    return (
        <View style={mapaStyle.container}>

            {Platform.OS === 'ios'
                ? (
                    <AppleMaps.View
                        style={mapaStyle.mapa}
                        cameraPosition={cameraPosition}
                        markers={appleMarkers}
                        showsUserLocation
                        onMarkerClick={(marker) => handleMarkerClick(marker.id)}
                    />
                ) : (
                    <GoogleMaps.View
                        style={mapaStyle.mapa}
                        cameraPosition={cameraPosition}
                        markers={googleMarkers}
                        showsUserLocation
                        onMarkerClick={(marker) => handleMarkerClick(marker.id)}
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
                                {podeColetar && (
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
                                        <MaterialIcons name="recycling" size={18} color="white" />
                                        <Text style={bottomSheetStyles.botaoAcaoTexto}>Coletar</Text>
                                    </TouchableOpacity>
                                )}

                                {podeConfirmar && (
                                    <TouchableOpacity
                                        style={[bottomSheetStyles.botaoAcao, { backgroundColor: '#1E90FF' }]}
                                        onPress={() => Alert.alert(
                                            'Confirmar coleta',
                                            'A coleta foi realizada?',
                                            [
                                                { text: 'Não', style: 'cancel' },
                                                { text: 'Sim', onPress: () => onConfirmar(reporteSelecionado.id) },
                                            ]
                                        )}
                                    >
                                        <MaterialIcons name="check-circle" size={18} color="white" />
                                        <Text style={bottomSheetStyles.botaoAcaoTexto}>Confirmar Coleta</Text>
                                    </TouchableOpacity>
                                )}

                                {podeCancelar && (
                                    <TouchableOpacity
                                        style={[bottomSheetStyles.botaoAcao, { backgroundColor: '#FF6B35' }]}
                                        onPress={() => Alert.alert(
                                            'Cancelar coleta',
                                            'Deseja cancelar a coleta e recolocar o reporte como Pendente?',
                                            [
                                                { text: 'Não', style: 'cancel' },
                                                { text: 'Sim', onPress: () => onCancelar(reporteSelecionado.id) },
                                            ]
                                        )}
                                    >
                                        <MaterialIcons name="cancel" size={18} color="white" />
                                        <Text style={bottomSheetStyles.botaoAcaoTexto}>Cancelar Coleta</Text>
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

