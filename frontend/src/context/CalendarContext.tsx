// frontend/src/context/CalendarContext.tsx

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CalendarState {
  isOpen: boolean;
  value: string;
  onChange: (value: string) => void;
  title: string;
  onClose: () => void;
}

interface CalendarContextType {
  openCalendar: (value: string, onChange: (value: string) => void, title?: string) => void;
  closeCalendar: () => void;
  calendarState: CalendarState;
}

const defaultState: CalendarState = {
  isOpen: false,
  value: "",
  onChange: () => {},
  title: "Selecione uma data",
  onClose: () => {},
};

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CalendarState>(defaultState);

  const openCalendar = useCallback(
    (value: string, onChange: (value: string) => void, title: string = "Selecione uma data") => {
      setState({
        isOpen: true,
        value,
        onChange,
        title,
        onClose: closeCalendar,
      });
    },
    []
  );

  const closeCalendar = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <CalendarContext.Provider value={{ openCalendar, closeCalendar, calendarState: state }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}