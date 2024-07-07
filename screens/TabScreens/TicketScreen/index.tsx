import { NavigationProp, RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import ListComponent from "../../../components/ListComponent";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { Ticket, useDatabase } from "../../../context/DatabaseContext";

type TypeRootStackParamList = {
  Detalhes: { ticketId: string | number };
  Tickets: { newTicketAdded: string | number };
  AddTicket: string;
};
type TypeRootStackParamList1 = {
  Tickets: { newTicketAdded: string | number };
};

function TicketsListScreen() {
  const navigation = useNavigation<NavigationProp<TypeRootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);

  const { getTicketsAsync, deleteTicketAsync, items } = useDatabase();

  const loadTickets = useCallback(async () => {
    setRefreshing(true);

    await getTicketsAsync();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadTickets();
  }, [navigation]);
  return (
    <View style={{ flex: 1 }}>
      <ListComponent
        items={items}
        loadItens={loadTickets}
        refreshing={refreshing}
        onItemPress={(item) => {
          navigation.navigate("Detalhes", { ticketId: item.id });
        }}
        onDeletePress={async (item) => {
          await deleteTicketAsync(Number(item.id));

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
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TicketsListScreen;
