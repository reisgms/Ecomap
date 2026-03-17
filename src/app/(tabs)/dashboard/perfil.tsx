import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";
import { perfilStyle } from "@/src/styles/perfilStyles";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Perfil() {
    const router = useRouter();

    const logout = async () => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado!");

      // Redireciona para login, substituindo a rota atual
      router.replace("/login");
    } catch (error: any) {
      console.error("Erro ao sair:", error.message);
    }
  };
  
    return (
        <View style={perfilStyle.container}>
            <Text>Aqui vai ser a tela de perfil</Text>

            <Button title="Logout" onPress={logout}/>

        </View>
    )
}