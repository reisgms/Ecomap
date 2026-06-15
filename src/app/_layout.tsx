import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../../contexts/authContext';

function RouteGuard() {
    const { usuario, loading, primeiroAcesso } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const tela = segments[0] as string | undefined;
        const telaPublica = !tela || tela === 'login' || tela === 'cadastro';
        const naBemVindo = tela === 'bemvindo';

        if (!usuario && !telaPublica) {
            // Não autenticado fora de tela pública → login
            router.replace('/login');
        } else if (usuario && telaPublica) {
            // Autenticado em tela pública → tela de boas-vindas
            router.replace('/bemvindo');
        } else if (usuario && naBemVindo) {
            // Já está na tela de boas-vindas — deixa o componente controlar a navegação
        }
    }, [usuario, loading]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="cadastro" />
            <Stack.Screen name="bemvindo" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RouteGuard />
        </AuthProvider>
    );
}
