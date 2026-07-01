import { MaterialIcons } from '@expo/vector-icons';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, FlatList, Image, Linking, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { coresPorTipo, statusConfig } from '../../../constantes/status';
import { useAuth } from '../../../contexts/authContext';
import { useCluster } from '../../../hooks/useCluster';
import { useLocation } from '../../../hooks/useLocation';
import { usePermissoesReporte } from '../../../hooks/usePermissioesReporte';
import { useReportes } from '../../../hooks/useReports';
import { Reporte } from '../../../types/reports';
import { CustomModal } from '../../components/modal components/modal';
import { bottomSheetStyles } from '../../styles/mapaBottomSheetStyles';
import { mapaStyle } from '../../styles/mapaStyles';

const TIPOS = Object.keys(coresPorTipo);

export default function Mapa() {
    const { usuario } = useAuth();
    const { location, status: statusLocalizacao, solicitarLocalizacao } = useLocation();
    const insets = useSafeAreaInsets();

    const [modalCriarVisible, setModalCriarVisible] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
    const [clusterReportes, setClusterReportes] = useState<Reporte[] | null>(null);

    const rotacaoIcone = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotacaoIcone, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [rotacaoIcone]);

    const {
        reportes,
        filtroTipos,
        setFiltroTipos,
        handleColetar,
        handleConfirmarColeta,
        handleCancelarColeta,
    } = useReportes(usuario, true);

    const clusters = useCluster(reportes, 40);

    const reporteSelecionado = idSelecionado
        ? (reportes.find(r => r.id === idSelecionado) ?? null)
        : null;

    const { podeColetar, podeConfirmar, podeCancelar } =
        usePermissoesReporte(reporteSelecionado, usuario?.uid);

    function toggleTipo(tipo: string) {
        setFiltroTipos(prev =>
            prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
        );
    }

    function limparFiltro() {
        setFiltroTipos([]);
    }

    function handleMarkerClick(markerId: string | undefined) {
        if (!markerId) return;
        const cluster = clusters.find(c => c.id === markerId);
        if (!cluster) return;

        if (cluster.reportes.length === 1) {
            setIdSelecionado(cluster.reportes[0].id);
        } else {
            setClusterReportes(cluster.reportes);
        }
    }

    function fecharDetalhes() {
        setIdSelecionado(null);
    }

    function fecharCluster() {
        setClusterReportes(null);
    }

    function abrirReporteDoCluster(reporte: Reporte) {
        setClusterReportes(null);
        setIdSelecionado(reporte.id);
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
        if (statusLocalizacao === 'negada' || statusLocalizacao === 'erro') {
            return (
                <View style={mapaStyle.loadingContainer}>
                    <MaterialIcons name="location-off" size={48} color="#FF6B35" />
                    <Text style={mapaStyle.loadingTexto}>
                        {statusLocalizacao === 'negada'
                            ? 'Precisamos da sua localização para mostrar o mapa'
                            : 'Não foi possível obter sua localização. Verifique se o GPS está ligado.'}
                    </Text>
                    <TouchableOpacity style={mapaStyle.loadingBotao} onPress={solicitarLocalizacao}>
                        <Text style={mapaStyle.loadingBotaoTexto}>Tentar novamente</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openSettings()}>
                        <Text style={mapaStyle.loadingLink}>Abrir configurações do app</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        const rotate = rotacaoIcone.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        return (
            <View style={mapaStyle.loadingContainer}>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <MaterialIcons name="explore" size={48} color="#4CAF50" />
                </Animated.View>
                <Text style={mapaStyle.loadingTexto}>Carregando mapa...</Text>
            </View>
        );
    }

    const googleMarkers: GoogleMaps.Marker[] = clusters.map((cluster) => ({
        id: cluster.id,
        coordinates: cluster.coordinates,
        title: cluster.reportes.length === 1
            ? (cluster.reportes[0].tipos?.[0] ?? 'Reporte')
            : `${cluster.reportes.length} reportes`,
    }));

    const appleMarkers: AppleMaps.Marker[] = clusters.map((cluster) => ({
        id: cluster.id,
        coordinates: cluster.coordinates,
        tintColor: cluster.reportes.length === 1
            ? (coresPorTipo[cluster.reportes[0].tipos?.[0]] ?? '#FF6B35')
            : '#333333',
    }));

    const cameraPosition = {
        coordinates: {
            latitude: location.latitude,
            longitude: location.longitude,
        },
        zoom: 15,
    };

    const todosSelecionados = filtroTipos.length === 0;

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
                        uiSettings={{ zoomControlsEnabled: false }}
                        contentPadding={{ bottom: insets.bottom + 100, end: 16 }}
                        onMarkerClick={(marker) => handleMarkerClick(marker.id)}
                    />
                )
            }

            {/* Filtros de tipo — topo central, respeitando safe area */}
            <View style={[mapaStyle.filtroBar, { top: insets.top + 8 }]}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={mapaStyle.filtroScroll}
                >
                    <TouchableOpacity
                        style={[mapaStyle.chip, todosSelecionados && mapaStyle.chipAtivo]}
                        onPress={limparFiltro}
                    >
                        <Text style={[mapaStyle.chipTexto, todosSelecionados && mapaStyle.chipTextoAtivo]}>
                            Todos
                        </Text>
                    </TouchableOpacity>

                    {TIPOS.map(tipo => {
                        const ativo = filtroTipos.includes(tipo);
                        return (
                            <TouchableOpacity
                                key={tipo}
                                style={[mapaStyle.chip, ativo && mapaStyle.chipAtivo]}
                                onPress={() => toggleTipo(tipo)}
                            >
                                <Text style={[mapaStyle.chipTexto, ativo && mapaStyle.chipTextoAtivo]}>
                                    {tipo}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Botão criar reporte */}
            <View style={[mapaStyle.viewBotao, { bottom: insets.bottom + 30 }]}>
                <TouchableOpacity style={mapaStyle.botao} onPress={() => setModalCriarVisible(true)}>
                    <Text style={mapaStyle.botaoTexto}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Modal criar reporte */}
            <CustomModal visible={modalCriarVisible} onClose={() => setModalCriarVisible(false)} />

            {/* Modal lista de cluster */}
            {clusterReportes && (
                <Modal
                    visible
                    transparent
                    animationType="slide"
                    onRequestClose={fecharCluster}
                >
                    <TouchableOpacity
                        style={bottomSheetStyles.overlay}
                        activeOpacity={1}
                        onPress={fecharCluster}
                    />
                    <View style={[bottomSheetStyles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
                        <View style={bottomSheetStyles.handle} />
                        <Text style={[bottomSheetStyles.titulo, { marginBottom: 12 }]}>
                            {clusterReportes.length} reportes neste local
                        </Text>
                        <FlatList
                            data={clusterReportes}
                            keyExtractor={r => r.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const cfg = statusConfig[item.status] ?? statusConfig['Pendente'];
                                return (
                                    <TouchableOpacity
                                        style={mapaStyle.clusterItem}
                                        onPress={() => abrirReporteDoCluster(item)}
                                    >
                                        <View style={mapaStyle.clusterItemEsquerda}>
                                            <Text style={mapaStyle.clusterItemTitulo}>
                                                Reporte #{item.id.slice(0, 6)}
                                            </Text>
                                            <View style={mapaStyle.clusterItemTiposRow}>
                                                {item.tipos.map(t => (
                                                    <View
                                                        key={t}
                                                        style={[mapaStyle.clusterItemTipoBadge, { backgroundColor: coresPorTipo[t] ?? '#aaa' }]}
                                                    >
                                                        <Text style={mapaStyle.clusterItemTipoTexto}>{t}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                            {item.descricao ? (
                                                <Text style={mapaStyle.clusterItemDescricao} numberOfLines={1}>
                                                    {item.descricao}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <View style={[mapaStyle.clusterItemBadge, { backgroundColor: cfg.cor }]}>
                                            <MaterialIcons name={cfg.icone} size={12} color="white" />
                                            <Text style={mapaStyle.clusterItemBadgeTexto}>{item.status}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            ItemSeparatorComponent={() => <View style={mapaStyle.clusterSeparador} />}
                        />
                    </View>
                </Modal>
            )}

            {/* Bottom sheet detalhes do reporte individual */}
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

                    <View style={[bottomSheetStyles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
                        <View style={bottomSheetStyles.handle} />

                        <ScrollView showsVerticalScrollIndicator={false}>

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

                            {reporteSelecionado.imagem && (
                                <Image
                                    source={{ uri: reporteSelecionado.imagem }}
                                    style={bottomSheetStyles.imagem}
                                />
                            )}

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
