import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../../contexts/authContext';
import { Stack } from 'expo-router';

function RouteGuard() {
    const { usuario, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const telaPublica = !segments[0]
            || segments[0] === 'login'
            || segments[0] === 'cadastro';

        if (!usuario && !telaPublica) {
            router.replace('/login');
        } else if (usuario && telaPublica) {
            router.replace('/(tabs)/mapa');
        }
    }, [usuario, loading, segments]);

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
            <Stack.Screen name="(tabs)/dashboard" /> {/* ← era "(tabs)" */}
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