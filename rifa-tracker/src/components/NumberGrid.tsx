import { RifaNumber } from '../types';
import styles from './NumberGrid.module.css';

interface NumberGridProps {
  numeros: RifaNumber[];
  onNumberClick: (num: RifaNumber) => void;
  onDelete: (num: RifaNumber) => void;
}

export default function NumberGrid({ numeros, onNumberClick, onDelete }: NumberGridProps) {
  return (
    <div className={styles.gridContainer}>
      {numeros.map((n) => (
        <div key={n.numero} className={styles.gridItem} style={{ position: 'relative' }}>
          <button
            onClick={() => onNumberClick(n)}
            className={`${styles.numberBtn} ${styles[n.estado]}`}
          >
            {n.numero.toString().padStart(3, '0')}
          </button>
          <button
            className={styles.deleteBtn}
            onClick={(e) => { e.stopPropagation(); onDelete(n); }}
            title="Eliminar"
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'red',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
