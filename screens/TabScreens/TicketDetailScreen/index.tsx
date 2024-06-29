import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ticket, getTicketDetailsAsync } from '../../../database';

 type TypeRootStackParamList = {
   Detalhes: { ticketId: string | number };
 };

function TicketDetailsScreen() {
   const route = useRoute<RouteProp<TypeRootStackParamList, 'Detalhes'>>();
   const [ticketDetails, setTicketDetails] = useState<Ticket | undefined>(undefined);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{ticketDetails.titulo}</Text>
      <Text>{`Descrição: ${ticketDetails.descricao}`}</Text>
      <Text>{`Solicitante: ${ticketDetails.solicitante}`}</Text>
      <Text>{`Data de Abertura: ${ticketDetails.dataAbertura}`}</Text>
      <Text>{`Status: ${ticketDetails.status}`}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TicketDetailsScreen;