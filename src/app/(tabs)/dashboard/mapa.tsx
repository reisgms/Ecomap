import { Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { mapaStyle } from '../../../styles/mapaStyles';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { CustomModal } from '../../../components/modal components/modal';
import { db } from "../../../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { getMapHTML } from './../../../components/map Components/mapComponent';

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
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permissão de localização negada');
                return;
            }
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        })();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "reportes"), (snapshot) => {
            const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReportes(dados);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (webViewRef.current && location && reportes.length >= 0) {
            const markers = reportes.map(r => ({
                lat: r.localizacao.latitude,
                lng: r.localizacao.longitude,
                title: r.tipos?.join(", ") ?? "",
                description: r.descricao ?? "",
                color: coresPorTipo[r.tipos?.[0]] || "#000000",
            }));

            webViewRef.current.injectJavaScript(`
                updateMarkers(${JSON.stringify(markers)});
                true;
            `);
        }
    }, [reportes, location]);

    const handleMapLoad = () => {
        const markers = reportes.map(r => ({
            lat: r.localizacao.latitude,
            lng: r.localizacao.longitude,
            title: r.tipos?.join(", ") ?? "",
            description: r.descricao ?? "",
            color: coresPorTipo[r.tipos?.[0]] || "#000000",
        }));
        webViewRef.current?.injectJavaScript(`
            updateMarkers(${JSON.stringify(markers)});
            true;
        `);
    };

    if (!location) {
        return (
            <View style={mapaStyle.container}>
                <Text>Carregando Mapa...</Text>
            </View>
        );
    }

    return (
        <View style={mapaStyle.container}>
            <WebView
                ref={webViewRef}
                style={mapaStyle.mapa}
                source={{ html: getMapHTML(location.latitude, location.longitude) }}
                javaScriptEnabled
                domStorageEnabled
                originWhitelist={['*']}
                onLoad={handleMapLoad}
            />

            <View style={mapaStyle.legenda}>
                {Object.entries(coresPorTipo).map(([tipo, cor]) => (
                    <View key={tipo} style={mapaStyle.legendaItem}>
                        <View style={[mapaStyle.legendaCircle, { backgroundColor: cor }]} />
                        <Text style={mapaStyle.legendaText}>{tipo}</Text>
                    </View>
                ))}
            </View>

            <View style={mapaStyle.viewBotao}>
                <TouchableOpacity style={mapaStyle.botao} onPress={() => setModalVisible(true)}>
                    <Text style={mapaStyle.botaoTexto}>+</Text>
                </TouchableOpacity>
            </View>

            <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
    );
}