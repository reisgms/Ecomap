// import React, {useState} from 'react';
// import { View, ScrollView, Text, TouchableOpacity, Image, Modal } from 'react-native';
// import { cardStyles } from '../components Sytles/cardStyles'

// type ReportCardProps = {
//     id: string;
//     title: string;
//     status: "Pendente" | "Em Coleta" | "Resolvido";
//     description: string;
//     image? : string;

// }

// export const  ReportCard : React.FC<ReportCardProps> = ({id, title, status, description, image}) => {
//     const [modalVisible, setModalVisible] = useState(false);

//     return (
//         <>
//         <TouchableOpacity style={cardStyles.card} onPress={() => setModalVisible(true)}>
//             {image && <Image source={{uri: image}} style={cardStyles.cardImage} />}
//             <View style={cardStyles.cardContent}>
//                 <Text style={cardStyles.cardTitle}>{title}</Text>
//                 <Text style={cardStyles.cardStatus}>{status}</Text>
//                 <Text numberOfLines={2}  style={cardStyles.cardDescription}>{description}</Text>
//             </View>
//         </TouchableOpacity>

//         <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
//             <ScrollView style={cardStyles.modalBox}>
//                 <Text style={cardStyles.modalTitle}>{title}</Text>
//                 <Text style={cardStyles.modalStatus}>{status}</Text>
//                 {image && <Image source={{uri: image}} style={cardStyles.modalImage} />}
//                 <Text style={cardStyles.modalDescription}>{description}</Text>

//                 <TouchableOpacity style={cardStyles.closeButton} onPress={() => setModalVisible(false)}>
//                     <Text style={cardStyles.closeText}>Fechar</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </Modal>
//         </>
//     );
// };







import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { cardStyles } from '../components Sytles/cardStyles';

type ReportCardProps = {
    id: string;
    descricao: string;
    tipos: string[];
    imagem?: string;
    timestamp: string;
    localizacao: {
        latitude: number;
        longitude: number;
    };
    status: "Pendente" | "Em Coleta" | "Resolvido";
};

export const ReportCard: React.FC<ReportCardProps> = ({
    id,
    descricao,
    tipos,
    imagem,
    timestamp,
    localizacao,
    status
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            {/* Card resumido */}
            <TouchableOpacity style={cardStyles.card} onPress={() => setModalVisible(true)}>
                {imagem && <Image source={{ uri: imagem }} style={cardStyles.cardImage} />}
                <View style={cardStyles.cardContent}>
                    <Text style={cardStyles.cardTitle}>Reporte #{id}</Text>
                    <Text style={cardStyles.cardStatus}>{status}</Text>
                    <Text numberOfLines={2} style={cardStyles.cardDescription}>{descricao}</Text>
                    <Text style={cardStyles.cardInfo}>{tipos.join(", ")}</Text>
                    <Text style={cardStyles.cardDate}>{new Date(timestamp).toLocaleString()}</Text>
                </View>
            </TouchableOpacity>

            {/* Modal detalhada */}
            <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <ScrollView contentContainerStyle={cardStyles.modalBox}>
                    <Text style={cardStyles.modalTitle}>Reporte #{id}</Text>
                    <Text style={cardStyles.modalStatus}>{status}</Text>

                    {imagem && <Image source={{ uri: imagem }} style={cardStyles.modalImage} />}

                    <View style={cardStyles.modalSection}>
                        <MaterialIcons name="description" size={20} color="#333" />
                        <Text style={cardStyles.modalLabel}>Descrição:</Text>
                        <Text style={cardStyles.modalValue}>{descricao}</Text>
                    </View>

                    <View style={cardStyles.modalSection}>
                        <MaterialIcons name="category" size={20} color="#333" />
                        <Text style={cardStyles.modalLabel}>Tipos:</Text>
                        <Text style={cardStyles.modalValue}>{tipos.join(", ")}</Text>
                    </View>

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




