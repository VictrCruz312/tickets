import { NavigationProp, useNavigation } from "@react-navigation/native";
import ListComponent from "../../../components/ListComponent";
import { Ticket, deleteTicketAsync, getTicketsAsync } from "../../../database";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

type TypeRootStackParamList = {
  Detalhes: { ticketId: string | number };
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
         type: 'success',
         position: "bottom",
         text1: 'Deletado!',
         text2: `O ticket ${item.id} foi deletado com sucesso!`,
         visibilityTime: 4000,
         autoHide: true,
       });
      }}
    />
  );
}

export default TicketsListScreen;
