import { StyleSheet } from "react-native";

export const inputStyles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginBottom: 12,
    },
    loginLabel: {
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 4,
        color: '#333',
    },
    inputBox: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        borderWidth: 1.5,
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#F0F0F0',
        borderColor: '#E0E0E0',
    },
    inputBoxFocado: {
        borderColor: '#4CAF50',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 15,
        color: '#1b1b1b',
    },
    icon: {
        marginRight: 8,
    },
    iconBotao: {
        paddingLeft: 8,
    },
});
