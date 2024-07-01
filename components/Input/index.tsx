import React, { forwardRef, useEffect, useState } from "react";
import { TextInput, TextInputProps, StyleSheet, View, Text } from "react-native";
import { useForm } from "../../context/FormContext";
import { MaterialIcons } from "@expo/vector-icons";

export type TypeValidate = {
  valid: boolean;
  msg?: string;
};
export interface InputProps extends TextInputProps {
  type?: "string" | "number" | "password";
  label?: string;
  required?: boolean;
  id: string;
  value: string;
  validate?: (value: InputProps["value"]) => TypeValidate;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ id, type, label, required = false, value, validate, onChangeText, ...rest }: InputProps, ref) => {
    let keyboardType: TextInputProps["keyboardType"] = "default";
    let secureTextEntry = false;
    const { setFieldValidity, isContextAvailable, validationTriggered, resetValidationTrigger } = useForm();
    const [{ valid, msg }, setValidationResult] = useState<{ valid: boolean; msg?: string }>({ valid: true });
    const [showError, setShowError] = useState(false);

    useEffect(() => {
      let result: TypeValidate = { valid: true, msg: "" };

      if (validate) {
        result = validate(value);
      }

      if (required && value.trim() === "") {
        result = { valid: false, msg: "Este campo é obrigatório." };
      } else if (!required && !validate) {
        result = { valid: true, msg: "" };
      }

      setValidationResult(result);
      if (isContextAvailable && valid !== result.valid) {
        setFieldValidity(id, result.valid);
      }
    }, [value, required, validate, id]);

    useEffect(() => {
      // Se a validação do formulário foi acionada, mostre os erros
      if (validationTriggered) {
        setShowError(true);
        resetValidationTrigger();
      }
    }, [validationTriggered, resetValidationTrigger]);

    // Calcula a cor da borda diretamente com base no estado atual de `isValid`
    const borderColor = !showError ? "gray" : valid ? "#007e7c" : "#dc3545";

    switch (type) {
      case "number":
        keyboardType = "numeric";
        break;
      case "password":
        secureTextEntry = true;
        break;
    }

    const handleChange = (text: string) => {
      setShowError(true);
      onChangeText && onChangeText(text);
    };

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label + (required ? " *" : "")}</Text>}
        <TextInput
          {...rest}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onChangeText={handleChange}
          style={[styles.input, { borderColor }]}
          ref={ref}
        />
        {!valid && showError && (
          <View style={styles.containerError}>
            <Text style={styles.error}>{msg}</Text>
            <MaterialIcons name="subdirectory-arrow-left" size={12} color="#dc3545" style={styles.arrowIcon} />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dadada",
    marginBottom: 15,
    position: "relative",
  },
  input: {
    height: 40,
    minWidth: "70%",
    maxWidth: "90%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  label: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#dadada",
    top: -12,
    left: 20,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  containerError: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  error: {
    color: "#dc3545",
    fontSize: 12,
    textAlign: "right",
    marginTop: 5,
  },
  arrowIcon: {
    alignSelf: "flex-end",
    marginLeft: 2,
  },
});

export default Input;
