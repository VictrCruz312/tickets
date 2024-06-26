import React, { ReactNode, createContext, useContext, useState } from "react";

interface IFormContext {
  setFieldValidity: (fieldId: string, isValid: boolean) => void;
  isFormValid: () => boolean;
  isContextAvailable: boolean;
  validationTriggered: boolean;
  resetValidationTrigger: () => void;
}

interface FormProviderProps {
  children: ReactNode;
}

const FormContext = createContext<IFormContext | undefined>(undefined);

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    return {
      isContextAvailable: false,
      setFieldValidity: () => {},
      isFormValid: () => true, // Supõe-se que seja válido se não estiver dentro de um FormProvider
      validationTriggered: false,
      resetValidationTrigger: () => {},
    };
  }
  return context;
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const [fieldValidity, setFieldValidityState] = useState<{ [key: string]: boolean }>({});
  const [isContextAvailable] = useState< boolean>(true);

  const setFieldValidity = (fieldId: string, isValid: boolean) => {
    setFieldValidityState((prev) => ({ ...prev, [fieldId]: isValid }));
  };

  const isFormValid = () => {
    setValidationTriggered(true);

    return Object.values(fieldValidity).every((isValid) => isValid);
  };

  const [validationTriggered, setValidationTriggered] = useState(false);

  const resetValidationTrigger = () => {
    setValidationTriggered(false);
  };

  return <FormContext.Provider value={{ setFieldValidity, isFormValid, isContextAvailable, validationTriggered, resetValidationTrigger}}>{children}</FormContext.Provider>;
};
