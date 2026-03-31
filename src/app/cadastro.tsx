import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Button, View } from "react-native";
import { auth } from "../../firebaseConfig";
import { Input } from "../components/input components/input";
import cadastroStyle from "../styles/cadastroStyle";

export default function Cadastro() {
  const router = useRouter();
  const { email: initialEmail, senha: initialSenha } = useLocalSearchParams();

  const [email, setEmail] = useState(Array.isArray(initialEmail) ? initialEmail[0] || "" : initialEmail || "");
  const [senha, setSenha] = useState(Array.isArray(initialSenha) ? initialSenha[0] || "" : initialSenha || "");
  const [nome, setNome] = useState(""); // exemplo de campo extra

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      console.log("Usuário cadastrado!");
      router.replace("/(tabs)/dashboard/mapa");
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error.message);
    }
  };

  return (
    <View style={cadastroStyle.container}>
      <Input title="Email" value={email} onChangeText={setEmail} />
      <Input title="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Button title="Cadastrar" onPress={signUp} />
    </View>
  );
}
