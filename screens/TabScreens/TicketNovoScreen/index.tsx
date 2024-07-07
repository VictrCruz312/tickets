import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useForm } from "../../../context/FormContext";
import { useDatabase } from "../../../context/DatabaseContext";
import { TouchableOpacity } from "react-native-gesture-handler";

type TypeRootStackParamList = {
  Tickets: { newTicketAdded: boolean | undefined };
};
function AddTicketScreen() {
  const navigation = useNavigation<NavigationProp<TypeRootStackParamList>>();
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const { isFormValid } = useForm();
  const { insertTicketAsync } = useDatabase();

    // Refs para os campos de entrada
    const tituloRef = useRef<TextInput>(null);
    const descricaoRef = useRef<TextInput>(null);
    const solicitanteRef = useRef<TextInput>(null);

  const handleAddTicket = async () => {
    try {
      if (!isFormValid()) {
        return;
      }
      await insertTicketAsync(titulo, descricao, solicitante, new Date().toISOString(), "1");

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        id="titulo"
        label="Título"
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Digite o título do ticket"
        required={true}
        returnKeyType="done"
        onSubmitEditing={() => descricaoRef.current?.focus()}
        ref={tituloRef}
      />
      <Input
        id="descricao"
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Digite a descrição do ticket"
        multiline
        required={true}
        returnKeyType="done"
        onSubmitEditing={() => solicitanteRef.current?.focus()}
        ref={descricaoRef}
      />
      <Input
        id="solicitante"
        label="Solicitante"
        value={solicitante}
        onChangeText={setSolicitante}
        placeholder="Nome do solicitante"
        required={true}
        returnKeyType="done"
        ref={solicitanteRef}
      />
      <Button title="Adicionar Ticket" onPress={handleAddTicket} type="salvar" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: "100%",
    backgroundColor: "#dadada",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  }
});

export default AddTicketScreen;
