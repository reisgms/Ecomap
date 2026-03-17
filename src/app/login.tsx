import { AntDesign, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native';
import logo from '../../assets/images/logo.png';
import loginStyle from '../styles/loginStyles';
import {Href, useRouter} from 'expo-router';
import { Input } from '../components/input components/input';
import { useState } from 'react';
import {auth} from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';



export default function login (){
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, senha);

            router.replace("/(tabs)/dashboard/mapa");
        } catch (error: any) {
            console.error('Erro ao Logar', error);

        if (error.code === "auth/user-not-found") {
            Alert.alert("Usuário não encontrado", "Redirecionando para a tela de cadastro.");
            router.push({pathname: "/cadastro",
                params:{email: email, senha: senha}}
            );

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

                    <TouchableOpacity style={loginStyle.googleButton}>
                        <AntDesign name='google' size={20}>
                            <Text style={{fontWeight: 'bold'}}>Continuar com Google</Text>
                            </AntDesign>
                    </TouchableOpacity>

                     <View style={loginStyle.boxLinha}>
                        <View style={loginStyle.linha}></View>
                        <Text style={{margin:10, color: 'lightgray', fontSize:14}}>Ou</Text>
                        <View style={loginStyle.linha}></View>
                    </View>

                    <Input title='Email' IconLeftName='email' IconLeft={MaterialIcons} value={email} onChangeText={setEmail}/>
                    <Input title='Senha' IconLeftName='lock' IconLeft={MaterialIcons} IconRight={AntDesign} IconRightName='eye' value={senha} onChangeText={setSenha} secureTextEntry/>

                    <TouchableOpacity style={loginStyle.button} onPress={login}>
                    <MaterialIcons name='login' size={20} color={'white'}/>
                    <Text style={{color: 'white', fontWeight: 'bold', paddingLeft: 10}}>Entrar</Text>
                    </TouchableOpacity>

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