import { StyleSheet } from "react-native";

export const reportesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  tabAtivo: {
    backgroundColor: "#4CAF50",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});
