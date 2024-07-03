import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ticket, closeTicketAsync, deleteTicketAsync, getTicketDetailsAsync, getTicketsAsync } from "../../../database";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Picker from "../../../components/Picker";
import ListComponent from "../../../components/ListComponent";
import Toast from "react-native-toast-message";

type TypeRootStackParamList = {
  Detalhes: { ticketId: string | number };
};

function TicketDetailsScreen() {
  const route = useRoute<RouteProp<TypeRootStackParamList, "Detalhes">>();
  const [ticketDetails, setTicketDetails] = useState<Ticket | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>("");
  const navigation = useNavigation<NavigationProp<TypeRootStackParamList>>();

  const fetchTicketDetails = async () => {
    const ticketId = route.params?.ticketId;

    if (ticketId && Number(ticketId)) {
      try {
        const details = await getTicketDetailsAsync(Number(ticketId));

        setTicketDetails(details);

        if (details) {
          setStatus(details.status);
          setDescription(details.descricaoEncerramento || "");
        }

      } catch (error) {
        console.log("details: " + error);
      }
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [route.params?.ticketId]);

  if (!ticketDetails) {
    return (
      <View style={styles.container}>
        <Text>Carregando detalhes do ticket...</Text>
      </View>
    );
  }

  const handleCloseTicket = async () => {
    try {
      await closeTicketAsync(ticketDetails.id, description, String(status));
      fetchTicketDetails();
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <ListComponent
        items={[ticketDetails]}
        onDeletePress={async (item) => {
          Alert.alert(
            "Confirmação",
            `Você realmente deseja deletar o ticket: ${item.titulo}?`,
            [
              {
                text: "Cancelar",
                onPress: () =>( Toast.show({
                  type: "info",
                  position: "bottom",
                  text1: "Ação Cancelada!",
                  text2: ``,
                  visibilityTime: 4000,
                  autoHide: true,
                })),
                style: "cancel"
              },
              { text: "Deletar", onPress: async () => {
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
                }
              }
            ]
          );
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
                value={description}
                onChangeText={(text) => setDescription(text)}
                type="string"
                returnKeyType="next"
              />
              <Picker
                id="options"
                selectedValue={status}
                onValueChange={(itemValue, itemIndex) => setStatus(String(itemValue))}
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
    // backgroundColor: "#dadada",
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
