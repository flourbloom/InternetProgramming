import { IsEmail, IsInt, IsString, Length, Max, Min } from 'class-validator';

// TODO C1: the same rules as validateBooking() in the Vue app.
//   name   string, 2 to 100 characters
//   email  a valid email address
//   seats  whole number from 1 to 4
// The server checks them again because anyone can send a request without our form.
export class CreateBookingDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(4)
  seats: number;
}

// incorrect 
// export function createBooking(
//   booking: CreateBookingDto
// ){
//   const errors: string[] = [];
//   const NAME = /^.{2,100}$/;
//   const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   //name
//   if(!NAME.test(booking.name.trim())) errors.push("Name must be 2-100 characters.");
//   //email
//   if(!EMAIL.test(booking.email.trim())) errors.push("Email must be a valid email address.");
//   //seats
//   if(booking.seats < 1 || booking.seats > 4) errors.push("Seats must be between 1 and 4.");

//   // return the errors
//   if(errors.length>0) return errors;
// }
