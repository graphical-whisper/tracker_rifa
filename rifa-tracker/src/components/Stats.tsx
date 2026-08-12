import { RifaNumber } from '../types';
import styles from './Stats.module.css';

interface StatsProps {
  numeros: RifaNumber[];
}

export default function Stats({ numeros }: StatsProps) {
  const disponibles = numeros.filter(n => n.estado === 'disponible').length;
  const reservados = numeros.filter(n => n.estado === 'reservado').length;
  const pagados = numeros.filter(n => n.estado === 'pagado').length;

  return (
    <div className={styles.statsContainer}>
      <div className={`${styles.statCard} glass`}>
        <h3 style={{ color: 'var(--color-pagado)' }}>Pagados</h3>
        <p className={styles.statNumber}>{pagados}</p>
      </div>
      <div className={`${styles.statCard} glass`}>
        <h3 style={{ color: 'var(--color-reservado)' }}>Reservados</h3>
        <p className={styles.statNumber}>{reservados}</p>
      </div>
      <div className={`${styles.statCard} glass`}>
        <h3 style={{ color: 'var(--color-disponible)' }}>Disponibles</h3>
        <p className={styles.statNumber}>{disponibles}</p>
      </div>
    </div>
  );
}
