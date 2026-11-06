import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service.js';
import type { Booking } from './booking.entity.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private nextId = 1;

  // Nest creates EventsService once and passes it in: dependency injection
  constructor(private readonly events: EventsService) { }

  findAll(): Booking[] {
    return [...this.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // TODO C2: create(eventId, dto)
  //   1. find the event (EventsService.findOne already throws 404)
  //   2. if dto.seats is more than the seats left, throw ConflictException (409)
  //      with a message such as "Only 3 seat(s) left"
  //   3. increase event.booked, store a new Booking with the next id and createdAt = now, return it

  create(eventId: number, dto: CreateBookingDto): Booking {
    // find the event
    const event = this.events.findOne(eventId)
    // check if seat left
    const seatsLeft = event.capacity - event.booked // capacity - booked = seats left
    if (dto.seats > seatsLeft) {
      throw new ConflictException(`Only ${seatsLeft} seat(s) left`)
    }
    // increase event.booked
    event.booked += dto.seats // or event.booked = dto.seats + event.booked
    // store a new Booking
    const newBooking: Booking = {
      id: this.nextId++,
      eventId: eventId,
      name: dto.name,
      email: dto.email,
      seats: dto.seats,
      createdAt: new Date().toISOString() // on contract can be found in 
    }
    this.bookings.push(newBooking)
    // return it
    return newBooking
  }

  // TODO C3: remove(id): 404 if the booking does not exist; give its seats back to the event; delete it.
  remove(id: number): void {
    // find the index of the booking
    const index = this.bookings.findIndex(booking => booking.id === id)
    // 404 if booking does not exist
    if (index === -1) {
      throw new NotFoundException(`Booking ${id} not found`)
    }
    // give its seats back to the event
    const booking = this.bookings[index]
    this.events.findOne(booking.eventId).booked -= booking.seats
    // delete it
    this.bookings.splice(index, 1)
  }
}
