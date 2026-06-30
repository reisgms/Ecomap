import { StyleSheet } from "react-native";

export const mapaStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    mapa: {
        flex: 1,
    },

    // Barra de filtros — topo central, posição top definida dinamicamente com insets
    filtroBar: {
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
    },
    filtroScroll: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.92)",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    chipAtivo: {
        backgroundColor: "#4CAF50",
    },
    chipTexto: {
        fontSize: 13,
        fontWeight: "600",
        color: "#333",
    },
    chipTextoAtivo: {
        color: "#fff",
    },

    // Lista de cluster
    clusterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    clusterItemEsquerda: {
        flex: 1,
        marginRight: 10,
    },
    clusterItemTitulo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 4,
    },
    clusterItemTiposRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 4,
    },
    clusterItemTipoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    clusterItemTipoTexto: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
    clusterItemDescricao: {
        fontSize: 12,
        color: '#777',
    },
    clusterItemBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        gap: 4,
    },
    clusterItemBadgeTexto: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
    },
    clusterSeparador: {
        height: 1,
        backgroundColor: '#eee',
    },

    // Botão flutuante de criar reporte
    viewBotao: {
        position: "absolute",
        right: 16,
    },
    botao: {
        backgroundColor: "#4CAF50",
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    botaoTexto: {
        fontSize: 28,
        color: "#fff",
        fontWeight: "bold",
        lineHeight: 32,
    },
});
