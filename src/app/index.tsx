import { useRouter } from "expo-router";
import { Text, Button, View } from "react-native";



export default function HOME() {
  const router = useRouter();
  return (
    <View style={{flex: 1,justifyContent: "center",alignItems: "center",}}>
      <Text>Bem-vindo ao Ecomap!</Text>
      <Button title="Faça Login" onPress={() => router.push('/login')}/>
        <Button title="Cadastre-se" onPress={() => router.push('/cadastro')}/>
    </View>
  );
}
