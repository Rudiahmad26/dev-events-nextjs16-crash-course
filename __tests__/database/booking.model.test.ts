import mongoose from 'mongoose';
import Booking from '@/database/booking.model';
import Event from '@/database/event.model';

const validEventData = {
  title: 'Test Event',
  description: 'A test event for booking validation',
  overview: 'Test event overview',
  image: 'https://example.com/image.jpg',
  venue: 'Test Venue',
  location: 'Test Location',
  date: '2024-12-15',
  time: '09:00',
  mode: 'online' as const,
  audience: 'Developers',
  agenda: ['Introduction'],
  organizer: 'Test Org',
  tags: ['test'],
};

describe('Booking Model', () => {
  let testEventId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db');
    }
  });

  beforeEach(async () => {
    const event = await new Event(validEventData).save();
    testEventId = event._id as mongoose.Types.ObjectId;
  });

  afterEach(async () => {
    await Booking.deleteMany({});
    await Event.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Schema Validation', () => {
    it('should create valid booking', async () => {
      const booking = new Booking({ eventId: testEventId, email: 'test@example.com' });
      const saved = await booking.save();
      expect(saved._id).toBeDefined();
      expect(saved.email).toBe('test@example.com');
    });

    it('should fail without eventId', async () => {
      const booking = new Booking({ email: 'test@example.com' } as any);
      await expect(booking.save()).rejects.toThrow();
    });

    it('should fail without email', async () => {
      const booking = new Booking({ eventId: testEventId } as any);
      await expect(booking.save()).rejects.toThrow();
    });

    it('should lowercase email', async () => {
      const booking = new Booking({ eventId: testEventId, email: 'TEST@EXAMPLE.COM' });
      const saved = await booking.save();
      expect(saved.email).toBe('test@example.com');
    });

    it('should trim email', async () => {
      const booking = new Booking({ eventId: testEventId, email: '  test@example.com  ' });
      const saved = await booking.save();
      expect(saved.email).toBe('test@example.com');
    });
  });

  describe('Email Validation', () => {
    it('should accept valid emails', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
      ];
      for (const email of validEmails) {
        const booking = new Booking({ eventId: testEventId, email });
        const saved = await booking.save();
        expect(saved.email).toBe(email.toLowerCase());
        await Booking.deleteMany({});
      }
    });

    it('should reject invalid emails', async () => {
      const invalid = ['invalid', 'invalid@', '@example.com', 'no domain@'];
      for (const email of invalid) {
        const booking = new Booking({ eventId: testEventId, email });
        await expect(booking.save()).rejects.toThrow();
      }
    });
  });

  describe('Pre-save Hook', () => {
    it('should fail for non-existent event', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const booking = new Booking({ eventId: fakeId, email: 'test@example.com' });
      await expect(booking.save()).rejects.toThrow(/does not exist/);
    });

    it('should succeed for existing event', async () => {
      const booking = new Booking({ eventId: testEventId, email: 'test@example.com' });
      const saved = await booking.save();
      expect(saved._id).toBeDefined();
    });
  });

  describe('Unique Constraint', () => {
    it('should allow same email for different events', async () => {
      const event2 = await new Event({ ...validEventData, title: 'Event 2' }).save();
      await new Booking({ eventId: testEventId, email: 'test@example.com' }).save();
      await new Booking({ eventId: event2._id, email: 'test@example.com' }).save();
      const bookings = await Booking.find({ email: 'test@example.com' });
      expect(bookings).toHaveLength(2);
    });

    it('should allow different emails for same event', async () => {
      await new Booking({ eventId: testEventId, email: 'user1@example.com' }).save();
      await new Booking({ eventId: testEventId, email: 'user2@example.com' }).save();
      const bookings = await Booking.find({ eventId: testEventId });
      expect(bookings).toHaveLength(2);
    });

    it('should prevent duplicate bookings', async () => {
      await new Booking({ eventId: testEventId, email: 'test@example.com' }).save();
      const duplicate = new Booking({ eventId: testEventId, email: 'test@example.com' });
      await expect(duplicate.save()).rejects.toThrow();
    });
  });

  describe('CRUD Operations', () => {
    it('should find by id', async () => {
      const saved = await new Booking({ eventId: testEventId, email: 'test@example.com' }).save();
      const found = await Booking.findById(saved._id);
      expect(found?.email).toBe('test@example.com');
    });

    it('should find by eventId', async () => {
      await Booking.create({ eventId: testEventId, email: 'user1@example.com' });
      await Booking.create({ eventId: testEventId, email: 'user2@example.com' });
      const bookings = await Booking.find({ eventId: testEventId });
      expect(bookings).toHaveLength(2);
    });

    it('should populate event details', async () => {
      await new Booking({ eventId: testEventId, email: 'test@example.com' }).save();
      const populated = await Booking.findOne({ email: 'test@example.com' }).populate('eventId');
      expect(populated?.eventId).toBeDefined();
      const event = populated?.eventId as any;
      expect(event.title).toBe('Test Event');
    });
  });
});