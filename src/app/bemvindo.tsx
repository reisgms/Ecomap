import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/authContext';

export default function BemVindo() {
    const { usuario, primeiroAcesso, marcarAcessoVisto } = useAuth();
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    async function entrarNoMapa() {
        await marcarAcessoVisto();
        router.replace('/(tabs)/mapa');
    }

    const titulo = primeiroAcesso
        ? `Bem-vindo ao Ecomap, ${usuario?.nome || ''}! 🌱`
        : `Bem-vindo de volta, ${usuario?.nome || ''}! 👋`;

    const subtitulo = primeiroAcesso
        ? 'Que bom ter você aqui! Juntos podemos tornar nosso ambiente mais limpo e sustentável. Reporte descartes irregulares no mapa e ajude sua comunidade.'
        : 'Que bom que voltou! Veja os novos reportes no mapa e continue fazendo a diferença.';

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="eco" size={72} color="#4CAF50" />
                </View>

                <Text style={styles.titulo}>{titulo}</Text>
                <Text style={styles.subtitulo}>{subtitulo}</Text>

                {primeiroAcesso && (
                    <View style={styles.dicasContainer}>
                        <View style={styles.dica}>
                            <MaterialIcons name="add-location" size={20} color="#4CAF50" />
                            <Text style={styles.dicaTexto}>Toque em + no mapa para reportar um descarte</Text>
                        </View>
                        <View style={styles.dica}>
                            <MaterialIcons name="recycling" size={20} color="#4CAF50" />
                            <Text style={styles.dicaTexto}>Clique num pin para oferecer coleta</Text>
                        </View>
                        <View style={styles.dica}>
                            <MaterialIcons name="notifications" size={20} color="#4CAF50" />
                            <Text style={styles.dicaTexto}>Você receberá notificações quando alguém coletar seu reporte</Text>
                        </View>
                    </View>
                )}

                <TouchableOpacity style={styles.botao} onPress={entrarNoMapa}>
                    <Text style={styles.botaoTexto}>
                        {primeiroAcesso ? 'Explorar o mapa' : 'Ver o mapa'}
                    </Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
        padding: 28,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#e8f5e9',
        borderRadius: 60,
        padding: 20,
        marginBottom: 24,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1b1b1b',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitulo: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    dicasContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 32,
    },
    dica: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
    },
    dicaTexto: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    botao: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    botaoTexto: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
