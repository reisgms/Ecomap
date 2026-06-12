import { StyleSheet } from "react-native";

export const mapaStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    mapa: {
        flex: 1,
    },
    legenda: {
        position: "absolute",
        top: 16,          // ← movida para cima para não conflitar com o bottom sheet
        left: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 12,
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    legendaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 3,
    },
    legendaCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginRight: 8,
    },
    legendaText: {
        fontSize: 12,
        color: "#333",
    },
    viewBotao: {
        position: "absolute",
        bottom: 30,
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
        shadowColor: '#000',
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