import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Alert, Image, TextInput } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { RegisterUserAsync, loginUserAsync } from "../../database";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";
import { FormProvider, useForm } from "../../context/FormContext";

type TypeRootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<TypeRootStackParamList, "Register">;

export type TypePropsNavigation = {
  navigation: RegisterScreenNavigationProp;
};

function RegisterScreen({ navigation }: TypePropsNavigation) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { isFormValid } = useForm();

  // Refs para os campos de entrada
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  // Função para simular o clique do botão "Cadastrar"
  const handleRegisterPress = async () => {
    if (!isFormValid) {
      Toast.show({
        type: "error",
        text1: "Campos inválidos",
        text2: "Confira os campos e tente novamente.",
        visibilityTime: 4000,
        autoHide: true,
      });

      return;
    }
    try {
      const registrado = await RegisterUserAsync({ email, password, name });

      if (registrado) {
        Toast.show({
          type: "success",
          position: "top",
          text1: "Registro bem-sucedido",
          text2: "Você foi logado com sucesso!",
          visibilityTime: 4000,
          autoHide: true,
          topOffset: 30,
        });

        setIsLoggedIn(isLoggedIn);
        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Falha ao Registrar",
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
        text2: "Ocorreu um erro ao tentar fazer o registro. Por favor, tente novamente mais tarde.",
        visibilityTime: 4000,
        autoHide: true,
      });

      console.log(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <FormProvider>
      <View style={styles.container}>
        <View style={styles.container}>
          <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
          <Input
            placeholder=""
            label="Usuário"
            id="usuario"
            required={true}
            value={name}
            onChangeText={(text) => setName(text)}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
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
            onSubmitEditing={handleRegisterPress}
            ref={emailRef}
          />
          <View style={styles.containerBottom}>
            <Button
              title="Cadastrar"
              type="salvar"
              onPress={handleRegisterPress}
              style={{ minWidth: "70%", maxWidth: "90%" }}
            />
          </View>
        </View>
      </View>
    </FormProvider>
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
  containerBottom: {
    minWidth: "70%",
    maxWidth: "90%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RegisterScreen;
