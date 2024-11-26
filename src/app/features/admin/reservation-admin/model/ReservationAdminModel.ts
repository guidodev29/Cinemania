export interface TicketAdmin {
  ticketId: string;
  ticketPrice: number;
  ticketPurchaseTime: string;
  seatNumber: number;
  seatRow: string;
  seatType: string;
  seatStatus: string;
  seatReservedAt: string | null;
}

export interface ReservationAdmin {
  reservationId: string;
  reservationTotalPrice: number;
  user_id: string;
  showingId: string;
  showingStartTime: string;
  showingEndTime: string;
  showingDate: string;
  movieName: string;
  movieDirector: string;
  movieDescription: string;
  roomType: string;
  roomPrice: number;
  roomNumber: number;
  tickets: TicketAdmin[];
}
