import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import TicketsListScreen from "../TabScreens/TicketScreen";
import TicketDetailsScreen from "../TabScreens/TicketDetailScreen";
import TicketsGraficScreen from "../TabScreens/TicketGraficsScreen";
import AddTicketScreen from "../TabScreens/TicketNovoScreen";
import { FormProvider } from "../../context/FormContext";

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Tickets" component={TicketsListScreen} />
      <Tab.Screen name="Detalhes" component={TicketDetailsScreen} />
      <Tab.Screen name="Grafico" component={TicketsGraficScreen} options={{ title: "Gráfico" }} />
      <Tab.Screen name="AddTicket" options={{ title: "Novo" }}>
        {() => (
          <FormProvider>
            <AddTicketScreen />
          </FormProvider>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default HomeScreen;
