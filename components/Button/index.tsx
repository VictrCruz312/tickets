// components/Button/index.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: "login" | "cancelar" | "salvar" | "deletar";
}

const Button: React.FC<ButtonProps> = ({ title, onPress, type = "login" }) => {
  const getIconName = (type: string) => {
    switch (type) {
      case "login":
        return "login";
      case "cancelar":
        return "cancel";
      case "salvar":
        return "save";
      case "deletar":
        return "delete";
      default:
        return "error";
    }
  };

  return (
    <TouchableOpacity style={[styles.button, styles[type]]} onPress={onPress}>
      <View style={styles.iconContainer}>
         <MaterialIcons name={getIconName(type)} size={24} color="#fff" />
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 10,
  },
  iconContainer: {},
  login: {
    backgroundColor: "#007bff",
  },
  cancelar: {
    backgroundColor: "#6c757d",
  },
  salvar: {
    backgroundColor: "#28a745",
  },
  deletar: {
    backgroundColor: "#dc3545",
  },
});

export default Button;