// frontend/src/components/DateField/DateField.tsx

import { format, parseISO } from "date-fns";
import { Calendar } from "lucide-react";
import styles from "./DateField.module.css";
import { useCalendar } from "../../context/CalendarContext";

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function DateField({ value, onChange, error, placeholder = "Selecione uma data" }: DateFieldProps) {
  const { openCalendar } = useCalendar();

  const displayValue = value ? format(parseISO(value), "dd/MM/yyyy") : "";

  const handleOpen = () => {
    openCalendar(value, onChange, placeholder);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.inputWrapper} ${error ? styles.inputError : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-label="Abrir seletor de data"
      >
        <span className={styles.value}>{displayValue || placeholder}</span>
        <Calendar size={18} className={styles.icon} />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}