import { useState, useMemo } from 'react';
import { RifaNumber } from '../types';
import styles from './ListView.module.css';

interface ListViewProps {
  numeros: RifaNumber[];
  onNumberClick: (num: RifaNumber) => void;
  onDelete: (num: RifaNumber) => void;
}

type FilterState = 'todos' | 'disponible' | 'reservado' | 'pagado';

export default function ListView({ numeros, onNumberClick, onDelete }: ListViewProps) {
  const [filter, setFilter] = useState<FilterState>('todos');

  const filteredNumbers = useMemo(() => {
    if (filter === 'todos') return numeros;
    return numeros.filter(n => n.estado === filter);
  }, [numeros, filter]);

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <button 
          className={`${styles.filterBtn} ${filter === 'todos' ? styles.active : ''}`}
          onClick={() => setFilter('todos')}
        >
          Todos
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'reservado' ? styles.active : ''}`}
          onClick={() => setFilter('reservado')}
        >
          Reservados
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'pagado' ? styles.active : ''}`}
          onClick={() => setFilter('pagado')}
        >
          Pagados
        </button>
        <button 
          className={`${styles.filterBtn} ${filter === 'disponible' ? styles.active : ''}`}
          onClick={() => setFilter('disponible')}
        >
          Disponibles
        </button>
      </div>

      <div className={`${styles.tableWrapper} glass`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Estado</th>
              <th>Comprador</th>
              <th>Teléfono</th>
              <th>Vendedor</th>
              <th>Fecha de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredNumbers.map((n) => (
              <tr key={n.numero}>
                <td className={styles.numCell}>
                  {n.numero.toString().padStart(3, '0')}
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[n.estado]}`}>
                    {n.estado.charAt(0).toUpperCase() + n.estado.slice(1)}
                  </span>
                </td>
                <td>{n.nombre_comprador || '-'}</td>
                <td>{n.telefono || '-'}</td>
                <td>{n.nombre_vendedor || '-'}</td>
                <td>{n.fecha_pago || '-'}</td>
                <td>
                  <button 
                    className={styles.editBtn} 
                    onClick={() => onNumberClick(n)}
                  >
                    Editar
                  </button>
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => onDelete(n)}
                    title="Eliminar"
                    style={{
                      marginLeft: '4px',
                      background: 'transparent',
                      border: 'none',
                      color: 'red',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
            {filteredNumbers.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  No hay números que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
