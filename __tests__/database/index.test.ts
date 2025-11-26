import * as DatabaseModels from '@/database';
import Event from '@/database/event.model';
import Booking from '@/database/booking.model';

describe('Database Index', () => {
  it('should export Event model', () => {
    expect(DatabaseModels.Event).toBe(Event);
  });

  it('should export Booking model', () => {
    expect(DatabaseModels.Booking).toBe(Booking);
  });

  it('should export IEvent type', () => {
    type TestIEvent = DatabaseModels.IEvent;
    const test: TestIEvent = {} as any;
    expect(test).toBeDefined();
  });

  it('should export IBooking type', () => {
    type TestIBooking = DatabaseModels.IBooking;
    const test: TestIBooking = {} as any;
    expect(test).toBeDefined();
  });

  it('should have model names', () => {
    expect(DatabaseModels.Event.modelName).toBe('Event');
    expect(DatabaseModels.Booking.modelName).toBe('Booking');
  });
});