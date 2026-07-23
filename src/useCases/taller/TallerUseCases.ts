import type { ITallerRepository } from '../../domain/repositories/ITallerRepository';
import type { TicketTaller, EstadoTicket } from '../../domain/entities/taller';

export class TallerUseCases {
  constructor(private tallerRepository: ITallerRepository) {}

  async getTickets(): Promise<TicketTaller[]> {
    return this.tallerRepository.getTickets();
  }

  async getTicketById(id: string): Promise<TicketTaller | null> {
    return this.tallerRepository.getTicketById(id);
  }

  async crearTicket(ticket: Omit<TicketTaller, 'id_servicio' | 'fecha_recepcion' | 'costo_total'>): Promise<TicketTaller> {
    // Aquí se podrían añadir validaciones de negocio antes de crear el ticket.
    return this.tallerRepository.createTicket(ticket);
  }

  async actualizarEstadoTicket(id: string, nuevoEstado: EstadoTicket): Promise<void> {
    // Aquí se podría agregar lógica para notificaciones o auditoría.
    return this.tallerRepository.updateEstadoTicket(id, nuevoEstado);
  }

  async actualizarTicket(id: string, ticket: Partial<TicketTaller>): Promise<void> {
    return this.tallerRepository.updateTicket(id, ticket);
  }

  async eliminarTicket(id: string): Promise<void> {
    return this.tallerRepository.deleteTicket(id);
  }
}
