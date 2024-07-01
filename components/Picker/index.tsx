import React, { forwardRef, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useForm } from "../../context/FormContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker as RNPicker } from "@react-native-picker/picker";

export type TypeValidate = {
  valid: boolean;
  msg?: string;
};

export interface PickerProps {
  id: string;
  label?: string;
  required?: boolean;
  selectedValue: string | number;
  onValueChange: (itemValue: string | number, itemIndex: number) => void;
  items: { label: string; value: string | number }[];
  validate?: (value: PickerProps["selectedValue"]) => TypeValidate;
}

const Picker = forwardRef<RNPicker<any>, PickerProps>((props, ref) => {
   const { id, label, required = false, selectedValue, onValueChange, items, validate } = props;
   const { setFieldValidity, isContextAvailable, validationTriggered, resetValidationTrigger } = useForm();
   const [{ valid, msg }, setValidationResult] = useState<{ valid: boolean; msg?: string }>({ valid: true });
   const [showError, setShowError] = useState(false);

   useEffect(() => {
     let result: TypeValidate = { valid: true, msg: "" };

     if (validate) {
       result = validate(selectedValue);
     }

     if (required && !selectedValue) {
       result = { valid: false, msg: "Este campo é obrigatório." };
     }

     setValidationResult(result);
     if (isContextAvailable && valid !== result.valid) {
       setFieldValidity(id, result.valid);
     }
   }, [selectedValue, required, validate, id]);

   useEffect(() => {
     if (validationTriggered) {
       setShowError(true);
       resetValidationTrigger();
     }
   }, [validationTriggered, resetValidationTrigger]);

   const borderColor = !showError ? "gray" : valid ? "#007e7c" : "#dc3545";

   return (
     <View style={[styles.container, { borderColor }]}>
       {label && <Text style={styles.label}>{label + (required ? " *" : "")}</Text>}
       <RNPicker
         selectedValue={selectedValue}
         onValueChange={(itemValue, itemIndex) => {
           setShowError(true);
           onValueChange(itemValue, itemIndex);
         }}
         style={styles.picker}
         ref={ref}
       >
         {items.map((item, index) => (
           <RNPicker.Item key={index} label={item.label} value={item.value} />
         ))}
       </RNPicker>
       {!valid && showError && (
         <View style={styles.containerError}>
           <Text style={styles.error}>{msg}</Text>
           <MaterialIcons name="subdirectory-arrow-left" size={12} color="#dc3545" style={styles.arrowIcon} />
         </View>
       )}
     </View>
   );
 });
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    minWidth: "70%",
    maxWidth: "90%",
  },
  picker: {
    height: 50,
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

export default Picker;
