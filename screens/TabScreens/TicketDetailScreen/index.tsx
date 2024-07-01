import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Ticket, getTicketDetailsAsync } from "../../../database";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Picker from "../../../components/Picker";

type TypeRootStackParamList = {
  Detalhes: { ticketId: string | number };
};

function TicketDetailsScreen() {
  const route = useRoute<RouteProp<TypeRootStackParamList, "Detalhes">>();
  const [ticketDetails, setTicketDetails] = useState<Ticket | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string | number>("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const ticketId = route.params?.ticketId;

      if (ticketId && Number(ticketId)) {
        try {
          const details = await getTicketDetailsAsync(Number(ticketId));

          setTicketDetails(details);
        } catch (error) {
          console.log("details: " + error);
        }
      }
    };

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
      //await closeTicketAsync(ticketDetails.id, description, status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{ticketDetails.titulo}</Text>
      <Text>{`Descrição: ${ticketDetails.descricao}`}</Text>
      <Text>{`Solicitante: ${ticketDetails.solicitante}`}</Text>
      <Text>{`Data de Abertura: ${ticketDetails.dataAbertura}`}</Text>
      <Text>{`Status: ${ticketDetails.status}`}</Text>
      <View style={styles.container1}>
        <Input
          placeholder="Descrição do Encerramento"
          label="Desc. Encerramento"
          id="desc"
          required={false}
          value={description}
          onChangeText={(text) => setDescription(text)}
          type="string"
          returnKeyType="next"
        />
        <Picker
          id="options"
          selectedValue={status}
          onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
          items={[
            { label: "Encerrado", value: "1" },
            { label: "Improcedente", value: "2" },
            { label: "Cancelado", value: "3" },
          ]}
        />
        <Button title="Encerrar Ticket" onPress={handleCloseTicket} type="login" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dadada",
    flex: 1,
    padding: 20,
  },
  container1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 20,
    minWidth: "70%",
    maxWidth: "90%",
    height: 50,
  },
});

export default TicketDetailsScreen;
