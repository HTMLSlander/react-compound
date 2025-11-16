import { useState } from "react";

/**
 * Custom hook for currency input formatting (USD)
 * Usage:
 * const [value, bind] = useCurrencyInput();
 * <input {...bind} />
 */
export function useCurrencyInput(initialValue: string = "") {
  const [inputValue, setInputValue] = useState<string>(initialValue);

  // Accept only numbers and decimal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.replace(/[^\d.]/g, ""));
  };

  // Format as currency on blur
  const handleBlur = () => {
    if (inputValue !== "") {
      setInputValue(
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(+inputValue)
      );
    }
  };

  // Remove formatting on focus for editing
  const handleFocus = () => {
    setInputValue(inputValue.replace(/[^0-9.]/g, ""));
  };

  return [
    inputValue,
    {
      value: inputValue,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
    },
  ] as const;
}
