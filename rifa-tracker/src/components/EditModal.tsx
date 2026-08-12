import { useState, useEffect } from 'react';
import { RifaNumber } from '../types';
import { getTodayDateString } from '../utils/quickTextParser';
import styles from './EditModal.module.css';

interface EditModalProps {
  numero: RifaNumber | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: RifaNumber) => void;
}

export default function EditModal({ numero, isOpen, onClose, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<RifaNumber | null>(null);
  const [quickInput, setQuickInput] = useState('');

  useEffect(() => {
    if (numero) {
      setFormData({ ...numero });
      setQuickInput('');
    }
  }, [numero]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleQuickInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuickInput(val);

    if (!val.trim()) return;

    const parts = val.split('/').map(p => p.trim());
    
    // Si la primera parte es un número y coincide con el número actual o es directamente el comprador:
    let offset = 0;
    if (parts[0] && !isNaN(parseInt(parts[0], 10)) && parseInt(parts[0], 10) === formData.numero) {
      offset = 1;
    }

    const comprador = parts[offset] !== undefined ? parts[offset] : formData.nombre_comprador;
    const telefono = parts[offset + 1] !== undefined ? parts[offset + 1] : formData.telefono;
    const vendedor = parts[offset + 2] !== undefined ? parts[offset + 2] : formData.nombre_vendedor;
    
    let estadoStr = parts[offset + 3] !== undefined ? parts[offset + 3].toLowerCase() : '';
    let estado: 'disponible' | 'reservado' | 'pagado' = formData.estado;

    if (estadoStr) {
      if (['pagado', 'p', 'pago'].includes(estadoStr)) {
        estado = 'pagado';
      } else if (['reservado', 'r', 'reserva'].includes(estadoStr)) {
        estado = 'reservado';
      } else if (['disponible', 'd', 'libre'].includes(estadoStr)) {
        estado = 'disponible';
      } else {
        estado = 'pagado';
      }
    } else if (parts[offset] !== undefined && parts[offset] !== '') {
      estado = 'pagado';
    }

    let fechaPago = parts[offset + 4] !== undefined ? parts[offset + 4] : formData.fecha_pago;

    // Si fecha omitida y estado pagado/reservado, usar fecha actual:
    if ((parts[offset + 4] === undefined || parts[offset + 4] === '') && (estado === 'pagado' || estado === 'reservado')) {
      fechaPago = getTodayDateString();
    }

    setFormData({
      ...formData,
      nombre_comprador: comprador,
      telefono,
      nombre_vendedor: vendedor,
      estado,
      fecha_pago: fechaPago,
    });
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
          <div className={styles.quickFormatBox}>
            <label>⚡ Relleno Rápido por Texto (separado por /):</label>
            <input 
              type="text"
              value={quickInput}
              onChange={handleQuickInputChange}
              placeholder="Comprador / Teléfono / Vendedor / Estado / Fecha"
              className={styles.quickFormatInput}
            />
            <span className={styles.quickFormatHint}>
              Ej: Juan Pérez / 555-1234 / Maria / pagado (Fecha omitida = hoy)
            </span>
          </div>

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
