// components/Button/index.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: "login" | "cancelar" | "salvar" | "deletar" | 'cadastrar';
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, type = "login", style }) => {
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
      case "cadastrar":
        return "person-add";
      default:
        return "error";
    }
  };

  return (
    <TouchableOpacity style={[styles.button, styles[type], style]} onPress={onPress}>
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
  cadastrar: {
    backgroundColor: "#17a2b8",
  },
});

export default Button;