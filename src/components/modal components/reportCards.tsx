import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cardStyles } from '../components Sytles/cardStyles';
import { statusConfig } from '../../../constantes/status';


type ReportCardProps = {
    id: string;
    descricao: string;
    tipos: string[];
    imagem?: string;
    timestamp: string;
    localizacao: { latitude: number; longitude: number };
    status: "Pendente" | "Em Coleta" | "Resolvido";
    donoNome?: string;
    coletorNome?: string;
};

export const ReportCard: React.FC<ReportCardProps> = ({
    id, descricao, tipos, imagem, timestamp, localizacao, status, donoNome, coletorNome
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { cor, icone } = statusConfig[status] ?? statusConfig["Pendente"];

    return (
        <>
            <TouchableOpacity style={cardStyles.card} onPress={() => setModalVisible(true)}>
                {imagem && <Image source={{ uri: imagem }} style={cardStyles.cardImage} />}
                <View style={cardStyles.cardContent}>
                    <Text style={cardStyles.cardTitle}>Reporte #{id.slice(0, 6)}</Text>

                    {/* Badge de status */}
                    <View style={[badge.container, { backgroundColor: cor }]}>
                        <MaterialIcons name={icone} size={12} color="white" />
                        <Text style={badge.texto}>{status}</Text>
                    </View>

                    <Text numberOfLines={2} style={cardStyles.cardDescription}>{descricao}</Text>
                    <Text style={cardStyles.cardInfo}>{tipos.join(', ')}</Text>
                    <Text style={cardStyles.cardDate}>{new Date(timestamp).toLocaleString()}</Text>
                </View>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <ScrollView contentContainerStyle={cardStyles.modalBox}>
                    <Text style={cardStyles.modalTitle}>Reporte #{id.slice(0, 6)}</Text>

                    <View style={[badge.container, { backgroundColor: cor, alignSelf: 'center', marginBottom: 12 }]}>
                        <MaterialIcons name={icone} size={14} color="white" />
                        <Text style={badge.texto}>{status}</Text>
                    </View>

                    {imagem && <Image source={{ uri: imagem }} style={cardStyles.modalImage} />}

                    <View style={cardStyles.modalSection}>
                        <MaterialIcons name="description" size={20} color="#333" />
                        <Text style={cardStyles.modalLabel}>Descrição:</Text>
                        <Text style={cardStyles.modalValue}>{descricao}</Text>
                    </View>

                    <View style={cardStyles.modalSection}>
                        <MaterialIcons name="category" size={20} color="#333" />
                        <Text style={cardStyles.modalLabel}>Tipos:</Text>
                        <Text style={cardStyles.modalValue}>{tipos.join(', ')}</Text>
                    </View>

                    {donoNome && (
                        <View style={cardStyles.modalSection}>
                            <MaterialIcons name="person" size={20} color="#333" />
                            <Text style={cardStyles.modalLabel}>Criado por:</Text>
                            <Text style={cardStyles.modalValue}>{donoNome}</Text>
                        </View>
                    )}

                    {coletorNome && (
                        <View style={cardStyles.modalSection}>
                            <MaterialIcons name="directions-run" size={20} color="#1E90FF" />
                            <Text style={cardStyles.modalLabel}>Coletor:</Text>
                            <Text style={cardStyles.modalValue}>{coletorNome}</Text>
                        </View>
                    )}

                    <View style={cardStyles.modalSection}>
                        <MaterialIcons name="event" size={20} color="#333" />
                        <Text style={cardStyles.modalLabel}>Data:</Text>
                        <Text style={cardStyles.modalValue}>{new Date(timestamp).toLocaleString()}</Text>
                    </View>

                    <View style={cardStyles.modalSection}>
                        <MaterialIcons name="location-on" size={20} color="#333" />
                        <Text style={cardStyles.modalLabel}>Localização:</Text>
                        <Text style={cardStyles.modalValue}>
                            Lat: {localizacao.latitude.toFixed(5)}, Lng: {localizacao.longitude.toFixed(5)}
                        </Text>
                    </View>

                    <TouchableOpacity style={cardStyles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={cardStyles.closeText}>Fechar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Modal>
        </>
    );
};

const badge = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, gap: 4, marginBottom: 4,
    },
    texto: { color: 'white', fontSize: 11, fontWeight: 'bold' },
});