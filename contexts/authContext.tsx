import { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as Notifications from 'expo-notifications';

// Configura handler globalmente aqui, fora do hook
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export type UsuarioLogado = {
    uid: string;
    nome: string;
    email: string;
    expoPushToken?: string | null;
    fotoUrl?: string | null;
};

type AuthContextType = {
    usuario: UsuarioLogado | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ usuario: null, loading: true });

async function registrarPushToken(uid: string) {
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') return;
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await updateDoc(doc(db, 'usuarios', uid), { expoPushToken: token });
    } catch (e) {
        console.warn('Erro ao registrar push token:', e);
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
            if (firebaseUser) {
                const ref = doc(db, 'usuarios', firebaseUser.uid);
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    const perfil = snap.data();
                    setUsuario({
                        uid: firebaseUser.uid,
                        nome: perfil.nome ?? firebaseUser.displayName ?? '',
                        email: firebaseUser.email ?? '',
                        expoPushToken: perfil.expoPushToken,
                        fotoUrl: perfil.fotoUrl ?? firebaseUser.photoURL ?? null,
                    });
                } else {
                    const novoPerfil = {
                        nome: firebaseUser.displayName ?? '',
                        email: firebaseUser.email ?? '',
                        fotoUrl: firebaseUser.photoURL ?? null,
                        expoPushToken: null,
                    };
                    await setDoc(ref, novoPerfil);
                    setUsuario({ uid: firebaseUser.uid, ...novoPerfil });
                }

                // Registra push token após login — momento correto
                await registrarPushToken(firebaseUser.uid);

            } else {
                setUsuario(null);
            }
            setLoading(false);
        });

        return unsub;
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}