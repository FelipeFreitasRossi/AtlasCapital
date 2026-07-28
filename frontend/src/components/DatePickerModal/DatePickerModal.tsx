// frontend/src/components/DatePickerModal/DatePickerModal.tsx

import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import styles from "./DatePickerModal.module.css";
import "react-day-picker/style.css";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  title?: string;
}

export function DatePickerModal({ isOpen, onClose, value, onChange, title = "Selecione uma data" }: DatePickerModalProps) {
  const [month, setMonth] = useState<Date>(() => {
    return value ? parseISO(value) : new Date();
  });

  const selectedDate = value ? parseISO(value) : undefined;

  useEffect(() => {
    if (value) {
      setMonth(parseISO(value));
    }
  }, [value]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            locale={ptBR}
            className={styles.calendar}
            showOutsideDays
            fixedWeeks
          />
        </div>

        <div className={styles.footer}>
          <button className={styles.clearButton} onClick={() => { onChange(""); onClose(); }}>
            Limpar data
          </button>
          <button className={styles.closeFooterButton} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}