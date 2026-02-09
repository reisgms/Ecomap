import { AntDesign, FontAwesome, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import logo from '../assets/images/logo.png';
import loginStyle from '../styles/loginStyles';



export default function login (){
    return ( 
        <View style={loginStyle.container}> 
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
                    <Text style={loginStyle.loginLabel}>E-mail</Text>
                    <View style={loginStyle.inputBox}>
                    <MaterialIcons name='email' size={20} color={'gray'}/>
                    <TextInput style={loginStyle.input}>seu@email.com</TextInput>
                </View>
                <Text style={loginStyle.loginLabel}>Senha</Text>
                <View style={loginStyle.inputBox}>
                    <MaterialIcons name='lock' size={20} color={'gray'}/>
                    <TextInput style={loginStyle.input}>********</TextInput>
                </View>
                    <TouchableOpacity style={loginStyle.button}>
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
        </View>
    )
};