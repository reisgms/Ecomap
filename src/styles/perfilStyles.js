import { StyleSheet } from "react-native";

export const perfilStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 24,
    },
    avatarContainer: {
        marginBottom: 20,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: '#4CAF50',
    },
    avatarPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        width: '100%',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    infoTextos: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValor: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginTop: 2,
    },
    divisor: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    botaoLogout: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e53935',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 10,
        gap: 8,
        width: '100%',
        justifyContent: 'center',
    },
    botaoLogoutTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});