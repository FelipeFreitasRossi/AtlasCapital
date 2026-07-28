import { DayPicker } from "react-day-picker";
import { useState, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import styles from "./DateField.module.css";
import "react-day-picker/style.css";

interface DateFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function DateField({ id, value, onChange, error, placeholder = "Selecione uma data" }: DateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value ? parseISO(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <input
        id={id}
        type="text"
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        value={value ? format(parseISO(value), "dd/MM/yyyy") : ""}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        readOnly
      />
      {isOpen && (
        <div className={styles.popover}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={ptBR}
          />
        </div>
      )}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}