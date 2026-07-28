// frontend/src/components/StockSelector/StockSelector.tsx

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import styles from "./StockSelector.module.css";

interface Stock {
  id: string;
  ticker: string;
  name: string;
}

interface StockSelectorProps {
  stocks: Stock[];
  value: string; // ticker selecionado
  onChange: (ticker: string) => void;
  placeholder?: string;
  label?: string;
}

export function StockSelector({ stocks, value, onChange, placeholder = "Buscar ação...", label }: StockSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedStock = stocks.find((s) => s.ticker === value);

  const filteredStocks = stocks.filter((stock) =>
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (ticker: string) => {
    onChange(ticker);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
    if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      // Foco no primeiro item, etc. (implementação simples)
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.control} onClick={handleInputClick}>
        <div className={styles.inputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder={selectedStock ? `${selectedStock.ticker} - ${selectedStock.name}` : placeholder}
            value={isOpen ? searchTerm : ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {filteredStocks.length === 0 ? (
            <div className={styles.emptyState}>Nenhuma ação encontrada</div>
          ) : (
            <ul className={styles.list}>
              {filteredStocks.map((stock) => (
                <li
                  key={stock.id}
                  className={`${styles.item} ${stock.ticker === value ? styles.itemSelected : ""} ${stock.id === "__new__" ? styles.itemSpecial : ""}`}
                  onClick={() => handleSelect(stock.ticker)}
                >
                  <span className={styles.ticker}>{stock.ticker}</span>
                  <span className={styles.name}>{stock.name}</span>
                  {stock.ticker === value && <Check size={16} className={styles.checkIcon} />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}