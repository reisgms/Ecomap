// import React, { use, useState } from "react";
// import { Modal, View, Text, TouchableOpacity, ScrollView,Image } from "react-native";
// import * as ImagePicker from 'expo-image-picker';
// import { modalStyles } from "../components Sytles/modalStyles";
// import { MaterialIcons } from '@expo/vector-icons';
// import { Input } from '../input components/input';

// type CustomModalProps = {
//     visible: boolean;
//     onClose: () => void;

// };

// export const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose }) => {
//     const [image, setImage] = useState<string | null>(null);
    
//     async function abrirCamera() {
//         const {status} = await ImagePicker.requestCameraPermissionsAsync();
//         if (status !== "granted") {
//             alert("Permissão para acessar a câmera negada");
//             return;

//         }

//         const resultado = await ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 1,
//         });
        
//         if (!resultado.canceled) {
//             setImage(resultado.assets[0].uri);
//         }
//     }

//     return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View style={modalStyles.overlay}>
//         <View style={modalStyles.modalBox}>
//           <ScrollView>
//             <TouchableOpacity style={modalStyles.photoSection} onPress={abrirCamera}>
//               {image ? (
//                 <Image source={{ uri: image }} style={modalStyles.photoPreview} />
//               ) : (
//                 <>
//                   <Text style={modalStyles.photoText}>Clique aqui para adicionar uma foto</Text>
//                   <MaterialIcons name="photo-camera" size={40} color="gray" />
//                 </>
//               )}
//             </TouchableOpacity>
//             <Input
//                 title="Descrição do reporte"
//                 placeholder="De detalhes sobre o descarte"
//             />


//           </ScrollView>

//           <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
//             <Text style={modalStyles.closeText}>X</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   ); 
// }






import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../input components/input';
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { modalStyles } from "../components Sytles/modalStyles";

const tipos = ["Orgânico", "Reciclável", "Madeira", "Ferro", "Móveis", "Eletrodomésticos"];

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [descricao, setDescricao] = useState<string>("");
  const [selecionados, setSelecionados] = useState<string[]>([]);

  async function abrirCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
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

  function marcarTipo(tipo: string) {
    if (selecionados.includes(tipo)) {
      setSelecionados(selecionados.filter(t => t !== tipo));
    } else {
      setSelecionados([...selecionados, tipo]);
    }
  }

  async function salvarReporte() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de localização negada");
        return;
      }
      const local = await Location.getCurrentPositionAsync({});

      const dados = {
        imagem: image,
        descricao,
        tipos: selecionados,
        timestamp: new Date().toISOString(),
        localizacao: {
          latitude: local.coords.latitude,
          longitude: local.coords.longitude,
        },
      };

      await addDoc(collection(db, "reportes"), dados);
      alert("Reporte salvo com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar no Firebase");
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
          <ScrollView contentContainerStyle={modalStyles.scrollContent}>
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
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={{ marginTop: 10, fontWeight: "bold" }}>Tipo de reporte:</Text>
            {tipos.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={modalStyles.checkboxRow}
                onPress={() => marcarTipo(tipo)}
              >
                <MaterialIcons
                  name={selecionados.includes(tipo) ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color="green"
                />
                <Text style={modalStyles.checkboxText}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={modalStyles.saveButton} onPress={salvarReporte}>
            <Text style={modalStyles.saveText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <Text style={modalStyles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
