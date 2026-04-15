import {Text, TouchableOpacity, View, Modal, ScrollView} from 'react-native';
import { useEffect,useState } from 'react';
import { mapaStyle } from '@/src/styles/mapaStyles';
import MapView, {Marker} from 'react-native-maps';
import { useRouter } from "expo-router";
import * as Location from 'expo-location';
import { CustomModal } from '@/src/components/input components/modal';


export default function Mapa() {
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permissão de localização negada');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    },[]);

    if (!location) {
        return (<View style={mapaStyle.container}>
            <Text>Carregando Mapa...</Text>
            </View>
        )
    }

    const router = useRouter();
    return (
        <View style={mapaStyle.container}>
            <MapView style={mapaStyle.mapa} initialRegion={{latitude:location.latitude, longitude: location.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01}} showsUserLocation={true} scrollEnabled={true} zoomEnabled={true}>
            </MapView>
            <View style={mapaStyle.legenda}>
                <Text>Pendente</Text>
                <Text>Em Coleta</Text>
                <Text>Resolvido</Text>
            </View>

            <View style={mapaStyle.viewBotao}>
                <TouchableOpacity style={mapaStyle.botao} onPress={() => setModalVisible(true)}>
                    <Text>+</Text>
                </TouchableOpacity>
            </View>

            <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)}/>               
        </View>

        
    )
}