export interface RifaNumber {
  numero: number;
  estado: 'disponible' | 'reservado' | 'pagado';
  nombre_comprador: string;
  nombre_vendedor: string;
  telefono: string;
  fecha_pago: string;
}
