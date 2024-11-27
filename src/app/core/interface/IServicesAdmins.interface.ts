import {ShowingDatesService} from "../services/admin/showing-dates.service";
import {ReservationService} from "../services/admin/reservation.service";

export interface ICategories {
  id: string;
  prefix: string;
}

export interface IRooms {
  id: string;
  roomNumber: number;
  capacity: number;
  type: string;
}

export interface IShowingDates {
  //TODO: MEJORAR SEGUN TYPE DATA
  id: string;
  showingDate: string;
}

export interface IReservation {
  reservationId: string;
  reservationTotalPrice: number;
  user_id: string;
  showingId: string;
  showingStartTime:string
  showingEndTime: string;
  showingDate: string;
  movieName: string;
  movieDirector: string;
  movieDescription: string;
  roomType: string;
  roomPrice: number;
  roomNumber: number;
  tickets: ITickets
}

export interface ITickets {
  ticketId: string;
  ticketPrice: number;
  ticketPurchaseTime: string;
  seatNumber: number;
  seatRow: string;
  seatType: string;
  seatStatus: string;
  seatReservedAt: string | null;
}
