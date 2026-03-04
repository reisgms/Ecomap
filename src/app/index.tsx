import { useRouter } from "expo-router";
import { Text, Button, View } from "react-native";
import { indexStyle } from "@/src/styles/indexStyle";


export default function HOME() {
  const router = useRouter();
  return (
    <View style={indexStyle.container}>
      <Text>Bem-vindo ao Ecomap!</Text>
      <Button title="Faça Login" onPress={() => router.push('/login')}/>
        <Button title="Cadastre-se" onPress={() => router.push('/cadastro')}/>
    </View>
  );
}
