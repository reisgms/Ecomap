import { StyleSheet } from "react-native";

export const cardStyles = StyleSheet.create({
    card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
    elevation: 3,
  },
  cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardStatus: { fontSize: 14, color: "gray" },
  cardDescription: { fontSize: 12, color: "#555" },

  modalBox: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalStatus: { fontSize: 16, marginBottom: 10 },
  modalImage: { width: "100%", height: 200, borderRadius: 10, marginBottom: 15 },
  modalDescription: { fontSize: 14, color: "#333", marginBottom: 20 },
  closeButton: { alignSelf: "center", padding: 10, backgroundColor: "#eee", borderRadius: 8 },
  closeText: { fontSize: 16 },
});