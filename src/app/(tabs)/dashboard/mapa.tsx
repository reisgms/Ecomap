import {Text, TouchableOpacity, View} from 'react-native';
import { mapaStyle } from '@/src/styles/mapaStyles';
import MapView, {Marker} from 'react-native-maps';
import { useRouter } from "expo-router";


export default function Mapa() {
    const router = useRouter();
    return (
        <View style={mapaStyle.container}>
            <MapView style={mapaStyle.mapa} initialRegion={{latitude:-3.1190, longitude: -60.0217, latitudeDelta: 0.05, longitudeDelta: 0.05}} scrollEnabled={true} zoomEnabled={true}>
                <Marker coordinate={{ latitude: -3065809, longitude: -60.050496 }}
                    title="Ponto inicial"
                    description="Exemplo de marcador"
                />
            </MapView>
            <View style={mapaStyle.legenda}>
                <Text>Pendente</Text>
                <Text>Em Coleta</Text>
                <Text>Resolvido</Text>
            </View>

            <View style={mapaStyle.viewBotao}>
                <TouchableOpacity style={mapaStyle.botao} 
                onPress={() => router.push('/(tabs)/dashboard/reportes')}><Text>+</Text></TouchableOpacity>
            </View>                
        </View>

        
    )
}