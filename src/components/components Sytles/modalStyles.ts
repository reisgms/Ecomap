import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get("window");

export const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: width * 0.9,
    height: height * 0.7,   // ocupa 70% da altura da tela
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    justifyContent: "space-between",
  },
  scrollContent: {
    flexGrow: 1,
  },
  photoSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    height: 250,
  },
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  photoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    flex: 1,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f44336",
    borderRadius: 20,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botoesRow: {
  flexDirection: "row",
  gap: 10,
  paddingHorizontal: 16,
  paddingVertical: 12,
},
cancelButton: {
  flex: 1,
  backgroundColor: "#e0e0e0",
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 10,
},
cancelText: {
  color: "#333",
  fontWeight: "bold",
  fontSize: 16,
},
});
