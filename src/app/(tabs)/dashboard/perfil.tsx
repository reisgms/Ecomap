import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";
import { perfilStyle } from "@/src/styles/perfilStyles";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function Perfil() {
    const router = useRouter();
    return (
        <View style={perfilStyle.container}>
            <Text>Aqui vai ser a tela de perfil</Text>

            <Button title="Logout" onPress={() => signOut(auth)}/>

        </View>
    )
}