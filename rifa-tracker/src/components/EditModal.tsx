import { useState, useEffect } from 'react';
import { RifaNumber } from '../types';
import styles from './EditModal.module.css';

interface EditModalProps {
  numero: RifaNumber | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: RifaNumber) => void;
}

export default function EditModal({ numero, isOpen, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<RifaNumber | null>(null);

  useEffect(() => {
    if (numero) {
      setFormData({ ...numero });
    }
  }, [numero]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass`}>
        <div className={styles.header}>
          <h2>Editar Número {formData.numero.toString().padStart(3, '0')}</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} className={styles.input}>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="pagado">Pagado</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Comprador</label>
            <input 
              type="text" 
              name="nombre_comprador" 
              value={formData.nombre_comprador} 
              onChange={handleChange} 
              className={styles.input}
              placeholder="Nombre del comprador"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Teléfono</label>
            <input 
              type="text" 
              name="telefono" 
              value={formData.telefono} 
              onChange={handleChange} 
              className={styles.input}
              placeholder="Teléfono del comprador"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Vendedor</label>
            <input 
              type="text" 
              name="nombre_vendedor" 
              value={formData.nombre_vendedor} 
              onChange={handleChange} 
              className={styles.input}
              placeholder="Nombre del vendedor"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Fecha de Pago</label>
            <input 
              type="date" 
              name="fecha_pago" 
              value={formData.fecha_pago} 
              onChange={handleChange} 
              className={styles.input}
            />
          </div>
          
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
