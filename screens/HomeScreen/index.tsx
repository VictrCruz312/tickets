import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import TicketsListScreen from "../TabScreens/TicketScreen";
import TicketDetailsScreen from "../TabScreens/TicketDetailScreen";
import { useAuth } from "../../context/AuthContext";
import TicketsGraficScreen from "../TabScreens/TicketGraficsScreen";

type TypeRootStackParamList = {
  Login: undefined;
};

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  const navigation = useNavigation<NavigationProp<TypeRootStackParamList>>();

  return (
      <Tab.Navigator>
        <Tab.Screen name="Tickets" component={TicketsListScreen} />
        <Tab.Screen name="Detalhes" component={TicketDetailsScreen} />
        <Tab.Screen name="Grafico" component={TicketsGraficScreen} options={{title: "Gráfico"}} />
      </Tab.Navigator>
  );
}

export default HomeScreen;
