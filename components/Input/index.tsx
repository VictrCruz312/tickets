import React, {forwardRef, useEffect, useState} from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';

export interface InputProps extends TextInputProps {
  type?: 'string' | 'number' | 'password';
  label?: string;
  required?: boolean;
  id: string;
  value: string;
  validate?: (value: InputProps["value"]) => boolean;
}

const Input = forwardRef<TextInput, InputProps>(({ type, label, required = false, value, validate, ...rest }: InputProps, ref) => {
  let keyboardType: TextInputProps['keyboardType'] = 'default';
  let secureTextEntry = false;

  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let validation: boolean | undefined = true;
    if (validate) {
      validation = validate(value);
    }

    if (required && (value.trim() === '')) {
      validation = false;
    } else if (!required && !validate) {
      validation = undefined;
    }

    setIsValid(validation);
  }, [value, required, validate]);

   // Calcula a cor da borda diretamente com base no estado atual de `isValid`
   const borderColor = isValid === undefined ? 'gray' : isValid ? '#007e7c' : '#dc3545';

  switch (type) {
    case 'number':
      keyboardType = 'numeric';
      break;
    case 'password':
      secureTextEntry = true;
      break;
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label + (required ? " *" : "")}</Text>}
      <TextInput
        {...rest}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, { borderColor }]}
        ref={ref}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dadada",
    marginBottom: 15,
    position: "relative"
  },
  input: {
    height: 40,
    minWidth: "70%",
    maxWidth: "90%",
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  label: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#dadada',
    top: -12,
    left: 20,
    paddingHorizontal: 10,
    fontSize: 14,
  },
});

export default Input;