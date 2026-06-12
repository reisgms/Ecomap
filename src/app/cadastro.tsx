import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { Input } from '../components/input components/input';
import { useRouter } from 'expo-router';

export default function Cadastro() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCadastro() {
        if (!nome || !email || !senha) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }
        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, senha);

            // Salva perfil no Firestore
            await setDoc(doc(db, 'usuarios', cred.user.uid), {
                nome,
                email,
                fotoUrl: null,
                expoPushToken: null,
            });

            // O RouteGuard detecta o login e redireciona automaticamente
        } catch (e: any) {
            const mensagens: Record<string, string> = {
                'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
                'auth/invalid-email': 'E-mail inválido.',
                'auth/weak-password': 'Senha muito fraca.',
            };
            Alert.alert('Erro ao cadastrar', mensagens[e.code] ?? e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Criar conta</Text>

            <Input title="Nome" placeholder="Seu nome" value={nome} onChangeText={setNome} />
            <Input title="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <Input title="Senha" placeholder="Mínimo 6 caracteres" value={senha} onChangeText={setSenha} secureTextEntry />

            <TouchableOpacity style={styles.botao} onPress={handleCadastro} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.botaoTexto}>Cadastrar</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Já tem conta? Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
    botao: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
    botaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    link: { textAlign: 'center', marginTop: 16, color: '#4CAF50' },
});