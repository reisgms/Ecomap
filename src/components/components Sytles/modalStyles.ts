import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  photoText: {
    marginBottom: 10,
    fontSize: 16,
    color: "gray",
  },
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  sectionText: {
    fontSize: 14,
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});