import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Perfil() {
    const router = useRouter();
    return (
        <View>
            <Text>Aqui vai ser a tela de perfil</Text>

            <Button title="Logout" onPress={() => {router.replace('/')}}/>

        </View>
    )
}