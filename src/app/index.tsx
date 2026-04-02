import { useRouter } from "expo-router";
import { Text, Button, View, TouchableOpacity, Image} from "react-native";
import { indexStyle } from "@/src/styles/indexStyle";
import logo from '../../assets/images/logo.png';


export default function HOME() {
  const router = useRouter();
  return (
    <View style={indexStyle.container}>
      <View style={indexStyle.logoContainer}>
        <Image style={indexStyle.logo} source={logo} resizeMode='contain'/>
        <Text style={indexStyle.logoText}>Bem-vindo ao Ecomap!</Text>
      </View>
      <TouchableOpacity style={indexStyle.botao1} onPress={() => router.push('/login')}>
        <Text style={indexStyle.botao1Text}>login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={indexStyle.botao2} onPress={() => router.push('/cadastro')}>
        <Text style={indexStyle.botao2Text}>Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
