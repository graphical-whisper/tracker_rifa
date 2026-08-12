'use client';

import { useState, useEffect } from 'react';
import { RifaNumber } from '../types';
import Stats from '../components/Stats';
import NumberGrid from '../components/NumberGrid';
import ListView from '../components/ListView';
import EditModal from '../components/EditModal';
import QuickRegistrationModal from '../components/QuickRegistrationModal';
import styles from './page.module.css';

type ViewMode = 'grid' | 'list';

export default function Home() {
  const [numeros, setNumeros] = useState<RifaNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<RifaNumber | null>(null);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
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

  const handleSaveBulk = async (updatedList: RifaNumber[]) => {
    try {
      const res = await fetch('/api/numeros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });

      if (!res.ok) throw new Error('Failed to bulk update');

      const savedList: RifaNumber[] = await res.json();
      const updatedMap = new Map(savedList.map(n => [n.numero, n]));

      setNumeros(prev => prev.map(n => updatedMap.get(n.numero) || n));
    } catch (err) {
      console.error('Error en inscripción rápida masiva:', err);
      alert('Hubo un error al procesar la inscripción rápida.');
      throw err;
    }
  };

  // New availability toggle handler (X button sets to "disponible")
  const handleMakeAvailable = async (num: RifaNumber) => {
    try {
      const updated = {
        ...num,
        estado: 'disponible',
        nombre_comprador: '',
        nombre_vendedor: '',
        telefono: '',
        fecha_pago: '',
      };
      const res = await fetch('/api/numeros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update availability');
      const returned = await res.json();
      setNumeros(prev => prev.map(n => n.numero === returned.numero ? returned : n));
    } catch (err) {
      console.error('Error updating availability:', err);
      alert('Hubo un error al cambiar la disponibilidad.');
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
        <p className={styles.subtitle}>Gestión de rifas</p>
      </div>

      <div className={styles.actionBar}>
        <button className={styles.quickBtn} onClick={() => setIsQuickModalOpen(true)}>
          Inscripción por Texto
        </button>
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
        <NumberGrid numeros={numeros} onNumberClick={setSelectedNumber} onDelete={handleMakeAvailable} />
      ) : (
        <ListView numeros={numeros} onNumberClick={setSelectedNumber} onDelete={handleMakeAvailable} />
      )}

      <EditModal
        numero={selectedNumber}
        isOpen={selectedNumber !== null}
        onClose={() => setSelectedNumber(null)}
        onSave={handleSave}
      />

      <QuickRegistrationModal
        isOpen={isQuickModalOpen}
        onClose={() => setIsQuickModalOpen(false)}
        existingNumbers={numeros}
        onSaveBulk={handleSaveBulk}
      />
    </main>
  );
}
