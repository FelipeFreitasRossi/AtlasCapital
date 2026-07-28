// frontend/src/components/CalendarModal/CalendarModal.tsx

import { DayPicker } from "react-day-picker";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import styles from "./CalendarModal.module.css";
import "react-day-picker/style.css";
import { useCalendar } from "../../context/CalendarContext";

export function CalendarModal() {
  const { calendarState, closeCalendar } = useCalendar();
  const { isOpen, value, onChange, title } = calendarState;

  const [month, setMonth] = useState<Date>(() => {
    return value ? parseISO(value) : new Date();
  });

  useEffect(() => {
    if (value) {
      setMonth(parseISO(value));
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
    closeCalendar();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCalendar();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCalendar();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCalendar]);

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

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button className={styles.closeButton} onClick={closeCalendar} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <DayPicker
            mode="single"
            selected={value ? parseISO(value) : undefined}
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
          <button className={styles.clearButton} onClick={() => { onChange(""); closeCalendar(); }}>
            Limpar data
          </button>
          <button className={styles.closeFooterButton} onClick={closeCalendar}>
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}