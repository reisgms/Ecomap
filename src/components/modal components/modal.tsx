import React, { useState } from "react";
import { ActivityIndicator, Alert, Modal, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../input components/input';
import { db, storage } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { modalStyles } from "../components Sytles/modalStyles";
import { useAuth } from '../../../contexts/authContext';
import { coresPorTipo } from '../../../constantes/status';

const tipos = Object.keys(coresPorTipo);

type CustomModalProps = {
    visible: boolean;
    onClose: () => void;
};

export const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose }) => {
    const { usuario } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [descricao, setDescricao] = useState('');
    const [selecionados, setSelecionados] = useState<string[]>([]);
    const [salvando, setSalvando] = useState(false);
    const [progressoUpload, setProgressoUpload] = useState(0);

    function limparCache() {
        setImage(null);
        setDescricao('');
        setSelecionados([]);
        setProgressoUpload(0);
    }

    async function abrirCamera() {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { alert('Permissão para acessar a câmera negada'); return; }
        const resultado = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 1 });
        if (!resultado.canceled) setImage(resultado.assets[0].uri);
    }

    async function comprimirImagem(uri: string): Promise<string> {
        const contexto = ImageManipulator.manipulate(uri).resize({ width: 1280 });
        const imagemRenderizada = await contexto.renderAsync();
        const resultado = await imagemRenderizada.saveAsync({ compress: 0.7, format: SaveFormat.JPEG });
        return resultado.uri;
    }

    async function uploadImagem(uri: string, uid: string): Promise<string> {
        const uriComprimida = await comprimirImagem(uri);
        const resposta = await fetch(uriComprimida);
        const blob = await resposta.blob();
        const imagemRef = storageRef(storage, `reportes/${uid}-${Date.now()}.jpg`);
        const tarefa = uploadBytesResumable(imagemRef, blob);

        return new Promise<string>((resolve, reject) => {
            tarefa.on(
                'state_changed',
                (snapshot) => {
                    setProgressoUpload(snapshot.bytesTransferred / snapshot.totalBytes);
                },
                reject,
                async () => {
                    try {
                        resolve(await getDownloadURL(tarefa.snapshot.ref));
                    } catch (erro) {
                        reject(erro);
                    }
                }
            );
        });
    }

    function marcarTipo(tipo: string) {
        setSelecionados(prev =>
            prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
        );
    }

    async function salvarReporte() {
        if (!usuario) { Alert.alert('Erro', 'Usuário não autenticado'); return; }
        if (selecionados.length === 0) { Alert.alert('Atenção', 'Selecione ao menos um tipo de resíduo.'); return; }
        if (salvando) return;
        setSalvando(true);
        setProgressoUpload(0);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { Alert.alert('Permissão negada', 'Permissão de localização negada'); return; }

            const [local, imagemUrl] = await Promise.all([
                Location.getCurrentPositionAsync({}),
                image ? uploadImagem(image, usuario.uid) : Promise.resolve(null),
            ]);

            await addDoc(collection(db, 'reportes'), {
                imagem: imagemUrl,
                descricao,
                tipos: selecionados,
                timestamp: new Date().toISOString(),
                localizacao: {
                    latitude: local.coords.latitude,
                    longitude: local.coords.longitude,
                },
                status: 'Pendente',
                donoId: usuario.uid,
                donoNome: usuario.nome,
            });

            Alert.alert('Sucesso', 'Reporte salvo com sucesso!');
            limparCache();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            Alert.alert('Erro', 'Erro ao salvar o reporte. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    }

    function handleCancelar() {
        limparCache();
        onClose();
    }

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancelar}>
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

                        <Input title="Descrição do reporte" placeholder="De detalhes sobre o descarte" value={descricao} onChangeText={setDescricao} />

                        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Tipo de reporte:</Text>
                        {tipos.map(tipo => (
                            <TouchableOpacity key={tipo} style={modalStyles.checkboxRow} onPress={() => marcarTipo(tipo)}>
                                <MaterialIcons
                                    name={selecionados.includes(tipo) ? 'check-box' : 'check-box-outline-blank'}
                                    size={24} color="green"
                                />
                                <Text style={modalStyles.checkboxText}>{tipo}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={modalStyles.botoesRow}>
                        <TouchableOpacity style={modalStyles.cancelButton} onPress={handleCancelar}>
                            <Text style={modalStyles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={modalStyles.saveButton} onPress={salvarReporte} disabled={salvando}>
                            {salvando
                                ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <ActivityIndicator color="#fff" size="small" />
                                        {image && <Text style={modalStyles.saveText}>{Math.round(progressoUpload * 100)}%</Text>}
                                    </View>
                                )
                                : <Text style={modalStyles.saveText}>Salvar</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};