import React, { use, useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView,Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';

type ModalProps = {
    visible: boolean;
    onClose: () => void;

};

export const Modal: React.FC<ModalProps> = ({ visible, onClose }) => {
    const [image, setImage] = useState<string | null>(null);
    
    async function abrirCamera() {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Permissão para acessar a câmera negada");
            return;

        }

        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        
        if (!resultado.canceled) {
            setImage(resultado.assets[0].uri);
        }
    }

    return (
        <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
        />
        <View style={Styles.}
    )
}