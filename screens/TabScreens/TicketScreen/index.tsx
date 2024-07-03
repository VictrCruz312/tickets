import { NavigationProp, useNavigation } from "@react-navigation/native";
import ListComponent from "../../../components/ListComponent";
import { Ticket, deleteTicketAsync, getTicketsAsync } from "../../../database";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type TypeRootStackParamList = {
  Detalhes: { ticketId: string | number };
  Tickets: string;
  AddTicket: string;
};

function TicketsListScreen() {
  const navigation = useNavigation<NavigationProp<TypeRootStackParamList>>();
  const [items, setItems] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getTicketsAsync();

      setItems(tickets);
    };

    fetchTickets();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <ListComponent
        items={items}
        onItemPress={(item) => {
          navigation.navigate("Detalhes", { ticketId: item.id });
        }}
        onDeletePress={async (item) => {
          await deleteTicketAsync(Number(item.id));
          const updatedTickets = await getTicketsAsync();
          setItems(updatedTickets);

          Toast.show({
            type: "success",
            position: "bottom",
            text1: "Deletado!",
            text2: `O ticket ${item.id} foi deletado com sucesso!`,
            visibilityTime: 4000,
            autoHide: true,
          });
        }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate("AddTicket");
        }}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TicketsListScreen;
