// frontend/src/components/ModalSelector/ModalSelector.tsx

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import styles from "./ModalSelector.module.css";

export interface SelectorOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface ModalSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectorOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function ModalSelector({
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  label,
  disabled = false,
}: ModalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const buttonRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.description && opt.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleOpen = () => {
    if (!disabled) setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  // Fecha ao clicar fora do modal (no overlay)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Fecha ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className={styles.wrapper} ref={buttonRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.control} ${disabled ? styles.disabled : ""}`}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={styles.value}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <span className={styles.modalTitle}>{label || "Selecione uma opção"}</span>
              <button className={styles.closeButton} onClick={handleClose} aria-label="Fechar">
                <X size={20} />
              </button>
            </div>

            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className={styles.listWrapper}>
              {filteredOptions.length === 0 ? (
                <div className={styles.emptyState}>Nenhuma opção encontrada</div>
              ) : (
                <ul className={styles.list}>
                  {filteredOptions.map((opt) => (
                    <li
                      key={opt.value}
                      className={`${styles.item} ${opt.value === value ? styles.itemSelected : ""}`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
                      <div className={styles.itemContent}>
                        <span className={styles.itemLabel}>{opt.label}</span>
                        {opt.description && <span className={styles.itemDescription}>{opt.description}</span>}
                      </div>
                      {opt.value === value && <Check size={18} className={styles.checkIcon} />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}