import { StyleSheet } from "react-native";

export const indexStyle = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    

    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: { 
        width: 200,
        height: 200,
    },
    logoText:{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },

    botao1:{
        height: 50,
        width: 100,
        padding: 10,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 15,
        
    },
    botao1Text:{
        color: 'white',
        fontWeight: 'bold',
    },
    botao2:{
        height: 50,
        width: 100,
        padding: 10,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
    },
    botao2Text:{
        color: 'white',
        fontWeight: 'bold',
    },
})