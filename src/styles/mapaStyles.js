import { StyleSheet } from "react-native";

export const mapaStyle = StyleSheet.create({
    container: {
        flex:1,
        
        
    },
    mapa:{
        flex: 1,
        
    },
    legenda: {
        position: "absolute",
        borderRadius: 12,
        backgroundColor: "#fff",
        bottom: 20,
        left: 20,
        padding: 10
    },
    botao: {
        backgroundColor: "green",
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    viewBotao: {
        position: "absolute",
        bottom: 20,
        right: 20,
        padding: 1
    }
})