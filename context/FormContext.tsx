import React, { ReactNode, createContext, useContext, useState } from "react";

interface IFormContext {
  setFieldValidity: (fieldId: string, isValid: boolean) => void;
  isFormValid: () => boolean;
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
    };
  }
  return context;
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const [fieldValidity, setFieldValidityState] = useState<{ [key: string]: boolean }>({});

  const setFieldValidity = (fieldId: string, isValid: boolean) => {
    setFieldValidityState((prev) => ({ ...prev, [fieldId]: isValid }));
  };

  const isFormValid = () => {
    return Object.values(fieldValidity).every((isValid) => isValid);
  };

  return <FormContext.Provider value={{ setFieldValidity, isFormValid }}>{children}</FormContext.Provider>;
};
