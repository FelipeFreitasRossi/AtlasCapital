import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale"; 
import { CalendarDays, X } from "lucide-react";
import "react-day-picker/style.css";
import "./datepicker-theme.css";
import styles from "./DatePicker.module.css";

interface DatePickerProps {
  id?: string;
  value: string; // "AAAA-MM-DD" ou ""
  onChange: (value: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  placeholder?: string;
}

// "AAAA-MM-DD" -> Date (meio-dia local, pra evitar problemas de fuso)
function parseIsoDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day, 12);
}

// Date -> "AAAA-MM-DD"
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Date -> "DD/MM/AAAA" (o que o usuário vê no campo)
function toDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint,
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= breakpoint);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

export function DatePicker({ id, value, onChange, onBlur, hasError, placeholder }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  const selectedDate = parseIsoDate(value);

  // Fecha o calendário ao clicar fora dele (apenas no modo popover;
  // no modo drawer o fechamento é sempre explícito, por um botão).
  useEffect(() => {
    if (!isOpen || isMobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMobile, onBlur]);

  // Impede o scroll do fundo enquanto a gaveta mobile está aberta.
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isMobile, isOpen]);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    onChange(toIsoDate(date));
    setIsOpen(false);
    onBlur?.();
  }

  function handleClose() {
    setIsOpen(false);
    onBlur?.();
  }

  const calendar = (
    <DayPicker
      mode="single"
      locale={ptBR}
      selected={selectedDate}
      onSelect={handleSelect}
      defaultMonth={selectedDate}
      showOutsideDays
      captionLayout="dropdown"
      startMonth={new Date(1990, 0)}
      endMonth={new Date(new Date().getFullYear() + 1, 11)}
      className={styles.calendar}
    />
  );

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        id={fieldId}
        className={`${styles.trigger} ${hasError ? styles.triggerError : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={selectedDate ? styles.triggerValue : styles.triggerPlaceholder}>
          {selectedDate ? toDisplayDate(selectedDate) : (placeholder ?? "DD/MM/AAAA")}
        </span>
        <CalendarDays size={16} className={styles.triggerIcon} />
      </button>

      {isOpen && !isMobile && (
        <div className={styles.popover} role="dialog" aria-label="Selecionar data">
          {calendar}
        </div>
      )}

      {isOpen && isMobile && (
        <div className={styles.drawerOverlay} onClick={handleClose}>
          <div
            className={styles.drawer}
            role="dialog"
            aria-label="Selecionar data"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Selecione a data</span>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={handleClose}
                aria-label="Fechar calendário"
              >
                <X size={18} />
              </button>
            </div>
            {calendar}
          </div>
        </div>
      )}
    </div>
  );
}
