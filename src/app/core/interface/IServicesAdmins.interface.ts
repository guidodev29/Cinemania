import {MovieAdmin} from "../../features/admin/movies-admin/Model/MovieAdmin";

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

export interface ISeats {
  id: string;
  seatType: string;
  status: string;
  roomNumber: number;
  row: string;
  seatNumber: number;
}

export interface ISeatStatus {
  seatStatusId: string;
  seatId: string;
}

export interface ISeatAllStatus {
  seatStatusId: string;
  seatId: string[];
}

export interface IShowings {
  id: string;
  room: IRooms
  movie: MovieAdmin
  showingDate: string;
  startTime: string;
  endTime: string;
}

export interface IUpdateShowing {
  roomId: string;
  movieId: string;
  showtimeId: string;
  startTime: Date;
}
