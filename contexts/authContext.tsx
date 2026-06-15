import { useEffect, useState, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import * as Notifications from 'expo-notifications';

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
    primeiroAcesso: boolean;
    marcarAcessoVisto: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    usuario: null,
    loading: true,
    primeiroAcesso: false,
    marcarAcessoVisto: async () => {},
});

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
    const [primeiroAcesso, setPrimeiroAcesso] = useState(false);

    useEffect(() => {
        let unsubDoc: (() => void) | null = null;
        let pushTokenRegistrado = false;

        const unsub = onAuthStateChanged(auth, (firebaseUser: User | null) => {
            if (unsubDoc) { unsubDoc(); unsubDoc = null; }
            pushTokenRegistrado = false;

            if (firebaseUser) {
                const ref = doc(db, 'usuarios', firebaseUser.uid);

                unsubDoc = onSnapshot(ref, async (snap) => {
                    if (snap.exists()) {
                        const perfil = snap.data();
                        setUsuario({
                            uid: firebaseUser.uid,
                            nome: perfil.nome ?? firebaseUser.displayName ?? '',
                            email: firebaseUser.email ?? '',
                            expoPushToken: perfil.expoPushToken,
                            fotoUrl: perfil.fotoUrl ?? firebaseUser.photoURL ?? null,
                        });
                        setPrimeiroAcesso(perfil.primeiroAcesso === true);

                        // Registra push token apenas uma vez por sessão, após o doc existir
                        if (!pushTokenRegistrado) {
                            pushTokenRegistrado = true;
                            registrarPushToken(firebaseUser.uid);
                        }
                    } else if (firebaseUser.displayName) {
                        // Primeiro login social (Google): cria perfil com flag de primeiro acesso
                        await setDoc(ref, {
                            nome: firebaseUser.displayName,
                            email: firebaseUser.email ?? '',
                            fotoUrl: firebaseUser.photoURL ?? null,
                            expoPushToken: null,
                            primeiroAcesso: true,
                        });
                        // onSnapshot dispara novamente com o doc criado
                    }
                    setLoading(false);
                });
            } else {
                setUsuario(null);
                setPrimeiroAcesso(false);
                setLoading(false);
            }
        });

        return () => {
            unsub();
            if (unsubDoc) unsubDoc();
        };
    }, []);

    async function marcarAcessoVisto() {
        if (!usuario) return;
        setPrimeiroAcesso(false);
        await updateDoc(doc(db, 'usuarios', usuario.uid), { primeiroAcesso: false });
    }

    return (
        <AuthContext.Provider value={{ usuario, loading, primeiroAcesso, marcarAcessoVisto }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
