import { RifaNumber } from '../types';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface ParsedQuickEntry {
  rawLine: string;
  isValid: boolean;
  error?: string;
  parsedNumber?: RifaNumber;
}

export function parseQuickTextLine(line: string, existingNumbers: RifaNumber[]): ParsedQuickEntry {
  const trimmed = line.trim();
  if (!trimmed) {
    return { rawLine: line, isValid: false, error: 'Línea vacía' };
  }

  const parts = trimmed.split('/').map(p => p.trim());
  
  if (parts.length === 0 || !parts[0]) {
    return { rawLine: line, isValid: false, error: 'Número no especificado' };
  }

  const numeroNum = parseInt(parts[0], 10);
  if (isNaN(numeroNum)) {
    return { rawLine: line, isValid: false, error: `El número "${parts[0]}" no es válido` };
  }

  const existing = existingNumbers.find(n => n.numero === numeroNum);
  if (!existing) {
    return { rawLine: line, isValid: false, error: `El número ${numeroNum} no existe en la rifa` };
  }

  const comprador = parts[1] !== undefined ? parts[1] : existing.nombre_comprador;
  const telefono = parts[2] !== undefined ? parts[2] : existing.telefono;
  const vendedor = parts[3] !== undefined ? parts[3] : existing.nombre_vendedor;
  
  let estadoStr = parts[4] !== undefined ? parts[4].toLowerCase() : '';
  let estado: 'disponible' | 'reservado' | 'pagado' = existing.estado;

  if (estadoStr) {
    if (['pagado', 'p', 'pago'].includes(estadoStr)) {
      estado = 'pagado';
    } else if (['reservado', 'r', 'reserva'].includes(estadoStr)) {
      estado = 'reservado';
    } else if (['disponible', 'd', 'libre'].includes(estadoStr)) {
      estado = 'disponible';
    } else {
      estado = 'pagado'; // por defecto si escribió algo no reconocido pero aportó datos
    }
  } else if (parts[1] !== undefined && parts[1] !== '') {
    // Si proporcionó comprador pero no estado, por defecto 'pagado'
    estado = 'pagado';
  }

  let fechaPago = parts[5] !== undefined ? parts[5] : existing.fecha_pago;

  // Si la fecha fue omitida en la entrada (parts[5] no provista o vacía) y el estado es pagado o reservado:
  if ((parts[5] === undefined || parts[5] === '') && (estado === 'pagado' || estado === 'reservado')) {
    fechaPago = getTodayDateString();
  }

  const parsedNumber: RifaNumber = {
    numero: numeroNum,
    estado,
    nombre_comprador: comprador,
    telefono,
    nombre_vendedor: vendedor,
    fecha_pago: fechaPago,
  };

  return {
    rawLine: line,
    isValid: true,
    parsedNumber,
  };
}

export function parseMultipleQuickTextLines(text: string, existingNumbers: RifaNumber[]): ParsedQuickEntry[] {
  const lines = text.split('\n');
  return lines
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(line => parseQuickTextLine(line, existingNumbers));
}
