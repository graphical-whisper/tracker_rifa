'use client';

import { useState, useEffect } from 'react';
import { RifaNumber } from '../types';
import Stats from '../components/Stats';
import NumberGrid from '../components/NumberGrid';
import ListView from '../components/ListView';
import EditModal from '../components/EditModal';
import styles from './page.module.css';

type ViewMode = 'grid' | 'list';

export default function Home() {
  const [numeros, setNumeros] = useState<RifaNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<RifaNumber | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNumeros = async () => {
    try {
      const res = await fetch('/api/numeros');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setNumeros(data);
    } catch (err) {
      setError('Error cargando los datos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumeros();
  }, []);

  const handleSave = async (updatedNumber: RifaNumber) => {
    try {
      const res = await fetch('/api/numeros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNumber),
      });
      
      if (!res.ok) throw new Error('Failed to update');
      
      const updated = await res.json();
      setNumeros(prev => prev.map(n => n.numero === updated.numero ? updated : n));
      setSelectedNumber(null);
    } catch (err) {
      console.error('Error actualizando:', err);
      alert('Hubo un error al guardar los cambios.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando rifa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Rifa Tracker</h1>
        <p className={styles.subtitle}>Gestión elegante y sencilla de tu rifa</p>
      </div>

      <Stats numeros={numeros} />
      
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.disponible}`}></span> Disponible</span>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.reservado}`}></span> Reservado</span>
        <span className={styles.legendItem}><span className={`${styles.dot} ${styles.pagado}`}></span> Pagado</span>
      </div>

      <div className={styles.viewTabs}>
        <button 
          className={`${styles.tabBtn} ${viewMode === 'grid' ? styles.activeTab : ''}`}
          onClick={() => setViewMode('grid')}
        >
          Cuadrícula
        </button>
        <button 
          className={`${styles.tabBtn} ${viewMode === 'list' ? styles.activeTab : ''}`}
          onClick={() => setViewMode('list')}
        >
          Listado de Administración
        </button>
      </div>

      {viewMode === 'grid' ? (
        <NumberGrid numeros={numeros} onNumberClick={setSelectedNumber} />
      ) : (
        <ListView numeros={numeros} onNumberClick={setSelectedNumber} />
      )}

      <EditModal 
        numero={selectedNumber} 
        isOpen={selectedNumber !== null} 
        onClose={() => setSelectedNumber(null)} 
        onSave={handleSave} 
      />
    </main>
  );
}
