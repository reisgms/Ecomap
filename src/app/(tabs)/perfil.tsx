import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useAuth } from "../../../contexts/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import {perfilStyle} from '../../styles/perfilStyles'

export default function Perfil() {
    const router = useRouter();
    const { usuario } = useAuth();

    const logout = async () => {
        try {
            await signOut(auth);
            router.replace("/login");
        } catch (error: any) {
            console.error("Erro ao sair:", error.message);
        }
    };

    return (
        <SafeAreaView style={perfilStyle.container} edges={['top']}>

            {/* Card do usuário */}
            <View style={perfilStyle.card}>
                {/* Avatar */}
                <View style={perfilStyle.avatarContainer}>
                    {usuario?.fotoUrl ? (
                        <Image source={{ uri: usuario.fotoUrl }} style={perfilStyle.avatar} />
                    ) : (
                        <View style={perfilStyle.avatarPlaceholder}>
                            <MaterialIcons name="person" size={48} color="#fff" />
                        </View>
                    )}
                </View>

                {/* Informações */}
                <View style={perfilStyle.infoContainer}>
                    <View style={perfilStyle.infoRow}>
                        <MaterialIcons name="person-outline" size={20} color="#4CAF50" />
                        <View style={perfilStyle.infoTextos}>
                            <Text style={perfilStyle.infoLabel}>Nome</Text>
                            <Text style={perfilStyle.infoValor}>{usuario?.nome ?? '—'}</Text>
                        </View>
                    </View>

                    <View style={perfilStyle.divisor} />

                    <View style={perfilStyle.infoRow}>
                        <MaterialIcons name="email" size={20} color="#4CAF50" />
                        <View style={perfilStyle.infoTextos}>
                            <Text style={perfilStyle.infoLabel}>E-mail</Text>
                            <Text style={perfilStyle.infoValor}>{usuario?.email ?? '—'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Botão logout */}
            <TouchableOpacity style={perfilStyle.botaoLogout} onPress={logout}>
                <MaterialIcons name="logout" size={20} color="#fff" />
                <Text style={perfilStyle.botaoLogoutTexto}>Sair da conta</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

