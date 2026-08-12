import { RifaNumber } from '../types';
import styles from './NumberGrid.module.css';

interface NumberGridProps {
  numeros: RifaNumber[];
  onNumberClick: (num: RifaNumber) => void;
}

export default function NumberGrid({ numeros, onNumberClick }: NumberGridProps) {
  return (
    <div className={styles.gridContainer}>
      {numeros.map((n) => (
        <button
          key={n.numero}
          onClick={() => onNumberClick(n)}
          className={`${styles.numberBtn} ${styles[n.estado]}`}
        >
          {n.numero.toString().padStart(3, '0')}
        </button>
      ))}
    </div>
  );
}
