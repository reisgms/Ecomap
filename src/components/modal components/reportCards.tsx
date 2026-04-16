import React, {useState} from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { cardStyles } from '../components Sytles/cardStyles'

type ReportCardProps = {
    id: string;
    title: string;
    status: "Pendente" | "Em Coleta" | "Resolvido";
    description: string;
    image? : string;

}

export const  ReportCard : React.FC<ReportCardProps> = ({id, title, status, description, image}) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
        <TouchableOpacity style={cardStyles.card} onPress={() => setModalVisible(true)}>
            {image && <Image source={{uri: image}} style={cardStyles.cardImage} />}
            <View style={cardStyles.cardContent}>
                <Text style={cardStyles.cardTitle}>{title}</Text>
                <Text style={cardStyles.cardStatus}>{status}</Text>
                <Text numberOfLines={2}  style={cardStyles.cardDescription}>{description}</Text>
            </View>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <ScrollView style={cardStyles.modalBox}>
                <Text style={cardStyles.modalTitle}>{title}</Text>
                <Text style={cardStyles.modalStatus}>{status}</Text>
                {image && <Image source={{uri: image}} style={cardStyles.modalImage} />}
                <Text style={cardStyles.modalDescription}>{description}</Text>

                <TouchableOpacity style={cardStyles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={cardStyles.closeText}>Fechar</Text>
                </TouchableOpacity>
            </ScrollView>
        </Modal>
        </>
    );
};

