import React, { use, useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView,Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { modalStyles } from "../components Sytles/modalStyles";
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../input components/input';

type CustomModalProps = {
    visible: boolean;
    onClose: () => void;

};

export const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose }) => {
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
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalBox}>
          <ScrollView>
            <TouchableOpacity style={modalStyles.photoSection} onPress={abrirCamera}>
              {image ? (
                <Image source={{ uri: image }} style={modalStyles.photoPreview} />
              ) : (
                <>
                  <Text style={modalStyles.photoText}>Clique aqui para adicionar uma foto</Text>
                  <MaterialIcons name="photo-camera" size={40} color="gray" />
                </>
              )}
            </TouchableOpacity>
            <Input
                title="Descrição do reporte"
                placeholder="De detalhes sobre o descarte"
            />


          </ScrollView>

          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ); 
}