import { AntDesign, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import logo from '../../assets/images/logo.png';
import loginStyle from '../styles/loginStyles';
import {useRouter} from 'expo-router';
import { Input } from '../components/input components/input';
import { useState, useEffect } from 'react';
import {auth} from '../../firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';



WebBrowser.maybeCompleteAuthSession();


export default function login (){
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    //Configuração para login com Google
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "217945753246-n8i8s13a4jvuftipdta0t6p9t3ld42ul.apps.googleusercontent.com"
    });

    //login com Google
    useEffect(() => {
        if (response?.type === 'success' && response.authentication) {
            const {authentication} = response;
            const credential = GoogleAuthProvider.credential(authentication.idToken);
            signInWithCredential(auth, credential)
            .then(() => router.replace("/(tabs)/dashboard/mapa"))
            .catch((error) => console.error("Erro Google:", error));
        }
    }, [response]);
            

    //Login com Email e senha
    const loginEmailSenha = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, senha);

            router.replace("/(tabs)/dashboard/mapa");
        } catch (error: any) {
            console.error('Erro ao Logar', error);

        if (error.code === "auth/invalid-credential") {
            Alert.alert("Credenciais inválidas");

        } else if (error.code === "auth/wrong-password") {
            Alert.alert("Senha incorreta", "Verifique sua senha e tente novamente.");

        } else if (error.code === "auth/invalid-email") {
            Alert.alert("Email inválido", "Digite um email válido.");
            
        } else {
            Alert.alert("Erro", "Não foi possível entrar. Tente novamente.");

        }
        }
    };

    return ( 
        <ScrollView contentContainerStyle={loginStyle.content}> 
            <Image style={{width: 120, height: 120}} source={logo} resizeMode='contain'/>
            <Text>Juntos por um ambiente mais limpo e sustentavel</Text>
            <View style={loginStyle.loginBox}> 
                <Text style={{fontWeight: 'bold', fontSize:24}}>Entrar</Text>

                    {/* Botão do Google */}
                    <TouchableOpacity style={loginStyle.googleButton} disabled={!request} onPress={() => promptAsync()}>
                        <AntDesign name='google' size={20}>
                            <Text style={{fontWeight: 'bold'}}>Continuar com Google</Text>
                            </AntDesign>
                    </TouchableOpacity>

                    {/* Box da linha */}
                     <View style={loginStyle.boxLinha}>
                        <View style={loginStyle.linha}></View>
                        <Text style={{margin:10, color: 'lightgray', fontSize:14}}>Ou</Text>
                        <View style={loginStyle.linha}></View>
                    </View>
                    {/* Fim do Box da linha */}

                    {/* Inputs de email/senha */}
                    <Input title='Email' IconLeftName='email' IconLeft={MaterialIcons} value={email} onChangeText={setEmail}/>
                    <Input title='Senha' IconLeftName='lock' IconLeft={MaterialIcons} IconRight={AntDesign} IconRightName='eye' value={senha} onChangeText={setSenha} secureTextEntry/>

                    {/* Botão login */}
                    <TouchableOpacity style={loginStyle.button} onPress={loginEmailSenha}>
                    <MaterialIcons name='login' size={20} color={'white'}/>
                    <Text style={{color: 'white', fontWeight: 'bold', paddingLeft: 10}}>Entrar</Text>
                    </TouchableOpacity>

                    {/* Esqueci minha senha e cadastro */}
                <Text style={{color:'green'}}>Esqueci minha Senha</Text>
                <Text>Não tem uma conta? <Text style={{color:'green', fontWeight:'bold'}}>Cadastre-se</Text></Text>
            </View>
            <View style={loginStyle.boxBottom}>
                <View style={loginStyle.miniBox1}>
                    <FontAwesome5 name='seedling' size={20}></FontAwesome5>
                    <Text>Denuncie</Text>
                </View>
                <View style={loginStyle.miniBox2}>
                    <FontAwesome name='recycle' size={20}></FontAwesome>
                    <Text>Conecte-se</Text>
                </View>
                <View style={loginStyle.miniBox3}>
                    <FontAwesome name='trophy' size={20}></FontAwesome>
                    <Text>Ganhe</Text>
                </View>
            </View>
        </ScrollView>
    )
};