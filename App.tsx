import "reflect-metadata";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen, { TypePropsNavigation } from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import { ComponentType, PropsWithChildren, useEffect } from "react";
import { initDBAsync, insertFakeTickets } from "./database";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { setIsLoggedIn } = useAuth();

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Inicio"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                setIsLoggedIn(false);
                navigation.navigate("Login");
              }}
              style={styles.logoutButton}
            >
              <MaterialIcons name="logout" size={24} color="red" />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
}

function withProtectedRoute(Component: ComponentType<PropsWithChildren<any>>) {
  return function ProtectedComponent(props: TypePropsNavigation) {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn) {
      // Se não estiver logado, redirecione para a tela de Login
      return <LoginScreen {...props} />;
    }
    // Se estiver logado, renderize o componente desejado
    return <Component {...props} />;
  };
}
export default function App() {
  useEffect(() => {
    async function init() {
      await initDBAsync();
      // await insertUserAsync("admin","admin@mail.com","123");
      // await insertFakeTickets();
    }

    try {
      init();
      console.log("Banco de dados inicializado com sucesso");
    } catch (error) {
      console.log("Falha ao inicializar o banco de dados: " + error);
    }
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Logar" }} />
          <Stack.Screen
            name="Home"
            component={withProtectedRoute(DrawerNavigator)}
            options={{
              headerTitle: () => (
                <View style={styles.headerTitle}>
                  <MaterialIcons name="confirmation-number" size={24} color="#007e7c" style={styles.headerIcon} />
                  <Text style={styles.headerText}>TI-ckets</Text>
                </View>
              ),
            }}
          />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 18,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 5,
  },
  headerText: {
    fontSize: 20,
    color: '#007e7c',
  },
});