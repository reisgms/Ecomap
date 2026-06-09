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
    bottom: 30,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12,
    borderRadius: 10,
    elevation: 4,
  },
  legendaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  legendaCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendaText: {
    fontSize: 14,
    color: "#333",
  },
  viewBotao: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  botao: {
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  botaoTexto: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
});
