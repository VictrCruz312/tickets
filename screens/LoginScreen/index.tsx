import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { TextInput } from "react-native-gesture-handler";
import { loginUserAsync } from "../../database";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";

type TypeRootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<TypeRootStackParamList, "Login">;

export type TypePropsNavigation = {
  navigation: LoginScreenNavigationProp;
};

function LoginScreen({ navigation }: TypePropsNavigation) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // Refs para os campos de entrada
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  // Função para simular o clique do botão "Cadastrar"
  const handleRegisterPress = () => {
    alert("Botão pressionado!");
  };

  const handleLogin = async () => {
    try {
      const isLoggedIn = await loginUserAsync(email, password);

      setIsLoggedIn(isLoggedIn);

      if (isLoggedIn) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "Login bem-sucedido",
          text2: "Você foi logado com sucesso!",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
        });

        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Falha no login",
          text2: "Email ou senha incorretos. Por favor, tente novamente.",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    } catch (error) {
      setIsLoggedIn(false);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.",
        visibilityTime: 4000,
        autoHide: true,
      });

      console.log(error);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("Home");
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
        {/* <Input
          placeholder=""
          label="Usuário"
          id="usuario"
          required={false}
          value={user}
          onChangeText={(text) => setUser(text)}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        /> */}
        <Input
          placeholder=""
          label="Senha"
          id="senha"
          required={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          type="password"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          ref={passwordRef}
        />
        <Input
          placeholder=""
          label="Email"
          id="email"
          required={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          ref={emailRef}
        />
        <View style={styles.containerBottons}>
          <Button title="Entrar" onPress={handleLogin} type="login" />
          <Button
            title="Registrar-se"
            type="redirecionar"
            onPress={() => {
              Alert.alert("teste: " + isLoggedIn);
              setIsLoggedIn(false);
              navigation.navigate("Home");
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dadada",
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 5,
  },
  containerBottons: {
    minWidth: "70%",
    maxWidth: "90%",
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }
});

export default LoginScreen;
