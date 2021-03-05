import { useState } from "react";

export const useForm = (inputs = {}) => {
  const [formValues, setFormValues] = useState(inputs);

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
  }

  const clearInputs = () => {
    setFormValues(inputs);
  }

  return [formValues, handleInputChange, clearInputs];
}
