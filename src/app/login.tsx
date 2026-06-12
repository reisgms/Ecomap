import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import logo from '../../assets/images/logo.png';
import loginStyle from '../styles/loginStyles';
import { useRouter } from 'expo-router';
import { Input } from '../components/input components/input';
import { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loadingEmail, setLoadingEmail] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);

    // ✅ Separe os clientIds por plataforma
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '217945753246-borcksj5edesl7kej6ahr6vtsgvkpe64.apps.googleusercontent.com',
        androidClientId: '217945753246-ttqmhl5ns4b84h8g91flk1d07koh46cr.apps.googleusercontent.com',
        iosClientId: '217945753246-6fr2jt110qds05rca43kv2q0rl8lfm23.apps.googleusercontent.com',
    });

    // ✅ Login com Google — verifica idToken antes de usar
    useEffect(() => {
        if (response?.type === 'success' && response.authentication) {
            const { idToken, accessToken } = response.authentication;

            if (!idToken) {
                Alert.alert('Erro', 'Não foi possível obter o token do Google.');
                setLoadingGoogle(false);
                return;
            }

            const credential = GoogleAuthProvider.credential(idToken, accessToken);
            signInWithCredential(auth, credential)
                .catch((error) => {
                    console.error('Erro Google:', error);
                    Alert.alert('Erro', 'Falha ao autenticar com Google.');
                })
                .finally(() => setLoadingGoogle(false));

        } else if (response?.type === 'error') {
            Alert.alert('Erro', 'Login com Google cancelado ou falhou.');
            setLoadingGoogle(false);
        }
    }, [response]);

    // ✅ Login com email/senha
    const loginEmailSenha = async () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha email e senha.');
            return;
        }

        setLoadingEmail(true);
        try {
            await signInWithEmailAndPassword(auth, email, senha);
        } catch (error: any) {
            console.error('Erro ao Logar', error);

            const mensagens: Record<string, string> = {
                'auth/invalid-credential': 'Credenciais inválidas.',
                'auth/wrong-password': 'Senha incorreta.',
                'auth/invalid-email': 'Email inválido.',
                'auth/user-not-found': 'Usuário não encontrado.',
                'auth/too-many-requests': 'Muitas tentativas. Aguarde um momento.',
            };

            Alert.alert('Erro', mensagens[error.code] ?? 'Não foi possível entrar. Tente novamente.');
        } finally {
            setLoadingEmail(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={loginStyle.content}>
            <Image style={{ width: 120, height: 120 }} source={logo} resizeMode="contain" />
            <Text>Juntos por um ambiente mais limpo e sustentavel</Text>

            <View style={loginStyle.loginBox}>
                <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Entrar</Text>

                {/* ✅ Botão Google — ícone e texto como irmãos no View */}
                <TouchableOpacity
                    style={loginStyle.googleButton}
                    disabled={!request || loadingGoogle}
                    onPress={() => {
                        setLoadingGoogle(true);
                        promptAsync();
                    }}
                >
                    {loadingGoogle ? (
                        <ActivityIndicator size="small" color="#333" />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <AntDesign name="google" size={20} />
                            <Text style={{ fontWeight: 'bold' }}>Continuar com Google</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Divisor */}
                <View style={loginStyle.boxLinha}>
                    <View style={loginStyle.linha} />
                    <Text style={{ margin: 10, color: 'lightgray', fontSize: 14 }}>Ou</Text>
                    <View style={loginStyle.linha} />
                </View>

                {/* Inputs */}
                <Input
                    title="Email"
                    IconLeftName="email"
                    IconLeft={MaterialIcons}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    title="Senha"
                    IconLeftName="lock"
                    IconLeft={MaterialIcons}
                    IconRight={AntDesign}
                    IconRightName="eye"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                />

                {/* Botão login */}
                <TouchableOpacity
                    style={loginStyle.button}
                    onPress={loginEmailSenha}
                    disabled={loadingEmail}
                >
                    {loadingEmail ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <MaterialIcons name="login" size={20} color="white" />
                            <Text style={{ color: 'white', fontWeight: 'bold', paddingLeft: 10 }}>Entrar</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={{ color: 'green' }}>Esqueci minha Senha</Text>

                <TouchableOpacity onPress={() => router.push('/cadastro')}>
                    <Text>
                        Não tem uma conta?{' '}
                        <Text style={{ color: 'green', fontWeight: 'bold' }}>Cadastre-se</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={loginStyle.boxBottom}>
                <View style={loginStyle.miniBox1}>
                    <FontAwesome5 name="seedling" size={20} />
                    <Text>Denuncie</Text>
                </View>
                <View style={loginStyle.miniBox2}>
                    <FontAwesome name="recycle" size={20} />
                    <Text>Conecte-se</Text>
                </View>
                <View style={loginStyle.miniBox3}>
                    <FontAwesome name="trophy" size={20} />
                    <Text>Ganhe</Text>
                </View>
            </View>
        </ScrollView>
    );
}