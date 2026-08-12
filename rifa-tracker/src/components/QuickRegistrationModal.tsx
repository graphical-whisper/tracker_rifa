import { useState, useMemo } from 'react';
import { RifaNumber } from '../types';
import { parseMultipleQuickTextLines, getTodayDateString } from '../utils/quickTextParser';
import styles from './QuickRegistrationModal.module.css';

interface QuickRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingNumbers: RifaNumber[];
  onSaveBulk: (updatedList: RifaNumber[]) => Promise<void>;
}

export default function QuickRegistrationModal({
  isOpen,
  onClose,
  existingNumbers,
  onSaveBulk,
}: QuickRegistrationModalProps) {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = getTodayDateString();

  const parsedResults = useMemo(() => {
    return parseMultipleQuickTextLines(inputText, existingNumbers);
  }, [inputText, existingNumbers]);

  const validEntries = useMemo(() => {
    return parsedResults
      .filter(r => r.isValid && r.parsedNumber)
      .map(r => r.parsedNumber!);
  }, [parsedResults]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validEntries.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSaveBulk(validEntries);
      setInputText('');
      onClose();
    } catch (err) {
      console.error('Error guardando inscripción rápida:', err);
      alert('Ocurrió un error al guardar los registros.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass`}>
        <div className={styles.header}>
          <h2>⚡ Inscripción Rápida por Texto</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className={styles.body}>
            <div className={styles.instructionBox}>
              <strong>Formato por línea (separado por <code>/</code>):</strong>
              <div><code>Número / Comprador / Teléfono / Vendedor / Estado / Fecha de pago</code></div>
              <ul>
                <li><strong>Fecha omitida:</strong> Si omitas la fecha (o la dejas vacía), se asignará automáticamente la fecha actual: <code>{todayStr}</code>.</li>
                <li><strong>Ejemplo:</strong> <code>015 / Juan Pérez / 555-1234 / María / pagado</code></li>
                <li><strong>Ejemplo con fecha:</strong> <code>022 / Ana Gómez / 555-9876 / Carlos / reservado / 2026-08-10</code></li>
              </ul>
            </div>

            <div className={styles.textareaGroup}>
              <label className={styles.label}>Escribe o pega tus inscripciones (una por línea):</label>
              <textarea
                className={styles.textarea}
                placeholder="Ejemplo:&#10;015 / Juan Pérez / 555-1234 / María / pagado&#10;022 / Ana Gómez / 555-9876 / Carlos / reservado"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
              />
            </div>

            {parsedResults.length > 0 && (
              <div className={styles.previewSection}>
                <div className={styles.previewTitle}>
                  <span>Vista Previa ({validEntries.length} válidas de {parsedResults.length} líneas)</span>
                </div>
                <div className={styles.previewTableWrapper}>
                  <table className={styles.previewTable}>
                    <thead>
                      <tr>
                        <th>Núm</th>
                        <th>Comprador</th>
                        <th>Teléfono</th>
                        <th>Vendedor</th>
                        <th>Estado</th>
                        <th>Fecha Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedResults.map((res, index) => {
                        if (!res.isValid || !res.parsedNumber) {
                          return (
                            <tr key={index} className={styles.invalidRow}>
                              <td colSpan={6} className={styles.errorText}>
                                ⚠️ "{res.rawLine}": {res.error}
                              </td>
                            </tr>
                          );
                        }

                        const n = res.parsedNumber;
                        const isAutoDate = n.fecha_pago === todayStr && !res.rawLine.includes(todayStr);

                        return (
                          <tr key={index} className={styles.validRow}>
                            <td><strong>{n.numero.toString().padStart(3, '0')}</strong></td>
                            <td>{n.nombre_comprador || '-'}</td>
                            <td>{n.telefono || '-'}</td>
                            <td>{n.nombre_vendedor || '-'}</td>
                            <td>
                              <span className={`${styles.badge} ${styles[n.estado]}`}>
                                {n.estado}
                              </span>
                            </td>
                            <td>
                              {n.fecha_pago || '-'}
                              {isAutoDate && (
                                <span className={styles.dateAutoBadge} title="Fecha asignada automáticamente">
                                  ⚡ (hoy)
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn} disabled={isSubmitting}>
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={validEntries.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : `Guardar ${validEntries.length} Registro(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
