// 






import { Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { mapaStyle } from '../../../styles/mapaStyles';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { CustomModal } from '../../../components/modal components/modal';
import { db } from "../../../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const coresPorTipo: Record<string, string> = {
    "Orgânico": "#8B4513",
    "Reciclável": "#4CAF50",
    "Madeira": "#A0522D",
    "Ferro": "#808080",
    "Móveis": "#FFD700",
    "Eletrodomésticos": "#1E90FF"
};

export default function Mapa() {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [reportes, setReportes] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permissão de localização negada');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "reportes"), (snapshot) => {
            const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReportes(dados);
        });
        return () => unsubscribe();
    }, []);

    if (!location) {
        return (
            <View style={mapaStyle.container}>
                <Text>Carregando Mapa...</Text>
            </View>
        );
    }

    return (
        <View style={mapaStyle.container}>
            <MapView
                style={mapaStyle.mapa}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
            >
                {reportes.map((reporte) => {
                    const cor = coresPorTipo[reporte.tipos?.[0]] || "#000";
                    return (
                        <Marker
                            key={reporte.id}
                            coordinate={{
                                latitude: reporte.localizacao.latitude,
                                longitude: reporte.localizacao.longitude,
                            }}
                            title={reporte.tipos.join(", ")}
                            description={reporte.descricao}
                            pinColor={cor}
                        />
                    );
                })}
            </MapView>

            {/* Legenda */}
            <View style={mapaStyle.legenda}>
                {Object.entries(coresPorTipo).map(([tipo, cor]) => (
                    <View key={tipo} style={mapaStyle.legendaItem}>
                        <View style={[mapaStyle.legendaCircle, { backgroundColor: cor }]} />
                        <Text style={mapaStyle.legendaText}>{tipo}</Text>
                    </View>
                ))}
            </View>

            {/* Botão flutuante */}
            <View style={mapaStyle.viewBotao}>
                <TouchableOpacity style={mapaStyle.botao} onPress={() => setModalVisible(true)}>
                    <Text style={mapaStyle.botaoTexto}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Modal fora do MapView */}
            <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
    );
}