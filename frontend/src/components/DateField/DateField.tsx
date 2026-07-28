// frontend/src/components/DateField/DateField.tsx

import { DayPicker } from "react-day-picker";
import { useState, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
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

  const clearDate = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.inputWrapper}>
        <CalendarIcon size={16} className={styles.calendarIcon} />
        <input
          id={id}
          type="text"
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          value={value ? format(parseISO(value), "dd/MM/yyyy") : ""}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          readOnly
        />
        {value && (
          <button
            className={styles.clearDate}
            onClick={clearDate}
            aria-label="Limpar data"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {isOpen && (
        <div className={styles.popover}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            locale={ptBR}
            className={styles.calendar}
          />
        </div>
      )}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}