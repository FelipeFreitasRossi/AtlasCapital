import { useState, useEffect, useRef } from "react";
import { Search, X, Check } from "lucide-react";
import styles from "./StockSelectorModal.module.css";

interface StockItem {
  id: string;
  ticker: string;
  name: string;
}

interface StockSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  selectedTicker: string;
  onSelect: (ticker: string) => void;
  title?: string;
}

export function StockSelectorModal({
  isOpen,
  onClose,
  stocks,
  selectedTicker,
  onSelect,
  title = "Selecionar ativo",
}: StockSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Foca no input ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Fecha ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Previne scroll do body quando modal está aberto
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

  const filtered = stocks.filter((item) =>
    item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (ticker: string) => {
    onSelect(ticker);
    onClose();
    setSearchTerm("");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por ticker ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.listWrapper}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>Nenhum ativo encontrado</div>
          ) : (
            <ul className={styles.list}>
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className={`${styles.item} ${item.ticker === selectedTicker ? styles.itemSelected : ""}`}
                  onClick={() => handleSelect(item.ticker)}
                >
                  <span className={styles.ticker}>{item.ticker}</span>
                  <span className={styles.name}>{item.name}</span>
                  {item.ticker === selectedTicker && (
                    <Check size={16} className={styles.checkIcon} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}