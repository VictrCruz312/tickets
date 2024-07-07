import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Picker from "../../../components/Picker";
import ListComponent from "../../../components/ListComponent";
import Toast from "react-native-toast-message";
import { Ticket, useDatabase } from "../../../context/DatabaseContext";

type TypeRootStackParamList = {
  Detalhes: { ticketId: string | number };
};

function TicketDetailsScreen() {
  const route = useRoute<RouteProp<TypeRootStackParamList, "Detalhes">>();
  const [ticketDetails, setTicketDetails] = useState<Ticket | undefined>(undefined);
  const navigation = useNavigation<NavigationProp<TypeRootStackParamList>>();
  const { items, closeTicketAsync, deleteTicketAsync } = useDatabase();

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const ticketId = route.params?.ticketId;
      const ticket = items.find((item) => item.id === ticketId);
      setTicketDetails(ticket);
    };

    fetchTicketDetails();
  }, [route.params?.ticketId, items]);

  if (!ticketDetails) {
    return (
      <View style={styles.container}>
        <Text>Carregando detalhes do ticket...</Text>
      </View>
    );
  }

  const handleCloseTicket = async () => {
    try {
      await closeTicketAsync(ticketDetails.id, ticketDetails.descricaoEncerramento, String(ticketDetails.status));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ListComponent
      items={[ticketDetails]}
      onDeletePress={async (item) => {
        Alert.alert("Confirmação", `Você realmente deseja deletar o ticket: ${item.titulo}?`, [
          {
            text: "Cancelar",
            onPress: () =>
              Toast.show({
                type: "info",
                position: "bottom",
                text1: "Ação Cancelada!",
                text2: ``,
                visibilityTime: 4000,
                autoHide: true,
              }),
            style: "cancel",
          },
          {
            text: "Deletar",
            onPress: async () => {
              await deleteTicketAsync(Number(item.id));
              Toast.show({
                type: "success",
                position: "bottom",
                text1: "Deletado!",
                text2: `O ticket: ${item.titulo}, foi deletado com sucesso!`,
                visibilityTime: 4000,
                autoHide: true,
              });
              navigation.goBack();
            },
          },
        ]);
      }}
      ListFooterComponent={
        <>
          <View style={styles.container}>
            <Input
              placeholder="Descrição do Encerramento"
              label="Desc. Encerramento"
              style={styles.widthMax}
              id="desc1"
              key="desc1"
              required={false}
              value={ticketDetails.descricaoEncerramento}
              onChangeText={(text) => setTicketDetails({ ...ticketDetails, descricaoEncerramento: text })}
              type="string"
              returnKeyType="next"
            />
            <Picker
              id="options"
              selectedValue={ticketDetails.status}
              onValueChange={(itemValue) => setTicketDetails({ ...ticketDetails, status: String(itemValue) })}
              style={styles.widthMax}
              items={[
                { label: "Aberto", value: "0" },
                { label: "Encerrado", value: "1" },
                { label: "Improcedente", value: "2" },
                { label: "Cancelado", value: "3" },
              ]}
            />
            <Button title="Encerrar Ticket" onPress={handleCloseTicket} type="salvar" />
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  widthMax: {
    minWidth: "100%",
    maxWidth: "100%",
  },
});

export default TicketDetailsScreen;
