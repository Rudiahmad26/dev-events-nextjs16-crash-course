import mongoose from 'mongoose';
import Event from '@/database/event.model';

const validEventData = {
  title: 'Next.js Conference 2024',
  description: 'A comprehensive conference about Next.js and React development with industry experts.',
  overview: 'Join us for an exciting day of learning about Next.js 16 and modern web development.',
  image: 'https://example.com/images/nextjs-conf.jpg',
  venue: 'Tech Convention Center',
  location: 'San Francisco, CA',
  date: '2024-12-15',
  time: '09:00',
  mode: 'hybrid' as const,
  audience: 'Developers, Tech Enthusiasts',
  agenda: ['Keynote Speech', 'Technical Workshops', 'Networking Session'],
  organizer: 'Next.js Community',
  tags: ['nextjs', 'react', 'javascript', 'web-development'],
};

describe('Event Model', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db');
    }
  });

  afterEach(async () => {
    await Event.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Schema Validation', () => {
    it('should create a valid event with all required fields', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();

      expect(savedEvent._id).toBeDefined();
      expect(savedEvent.title).toBe(validEventData.title);
      expect(savedEvent.slug).toBe('nextjs-conference-2024');
      expect(savedEvent.mode).toBe('hybrid');
      expect(savedEvent.agenda).toHaveLength(3);
      expect(savedEvent.tags).toHaveLength(4);
    });

    it('should fail validation when title is missing', async () => {
      const invalidEvent = new Event({ ...validEventData, title: undefined });
      await expect(invalidEvent.save()).rejects.toThrow();
    });

    it('should fail validation when title exceeds 100 characters', async () => {
      const invalidEvent = new Event({ ...validEventData, title: 'A'.repeat(101) });
      await expect(invalidEvent.save()).rejects.toThrow();
    });

    it('should fail validation with invalid mode value', async () => {
      const invalidEvent = new Event({ ...validEventData, mode: 'invalid' as any });
      await expect(invalidEvent.save()).rejects.toThrow();
    });

    it('should accept all valid mode values', async () => {
      for (const mode of ['online', 'offline', 'hybrid'] as const) {
        const event = new Event({ ...validEventData, mode, title: `Event ${mode}` });
        const saved = await event.save();
        expect(saved.mode).toBe(mode);
        await Event.deleteMany({});
      }
    });

    it('should fail when agenda is empty array', async () => {
      const invalidEvent = new Event({ ...validEventData, agenda: [] });
      await expect(invalidEvent.save()).rejects.toThrow();
    });

    it('should trim whitespace from string fields', async () => {
      const event = new Event({ ...validEventData, title: '  Spaced  ', venue: '  Venue  ' });
      const saved = await event.save();
      expect(saved.title).toBe('Spaced');
      expect(saved.venue).toBe('Venue');
    });
  });

  describe('Slug Generation', () => {
    it('should generate slug from title', async () => {
      const event = new Event(validEventData);
      const saved = await event.save();
      expect(saved.slug).toBe('nextjs-conference-2024');
    });

    it('should convert to lowercase', async () => {
      const event = new Event({ ...validEventData, title: 'UPPERCASE' });
      const saved = await event.save();
      expect(saved.slug).toBe('uppercase');
    });

    it('should replace spaces with hyphens', async () => {
      const event = new Event({ ...validEventData, title: 'Event With Spaces' });
      const saved = await event.save();
      expect(saved.slug).toBe('event-with-spaces');
    });

    it('should remove special characters', async () => {
      const event = new Event({ ...validEventData, title: 'Event! @#$' });
      const saved = await event.save();
      expect(saved.slug).toBe('event');
    });

    it('should regenerate on title change', async () => {
      const event = new Event(validEventData);
      const saved = await event.save();
      saved.title = 'Updated Title';
      const updated = await saved.save();
      expect(updated.slug).toBe('updated-title');
    });

    it('should enforce unique slugs', async () => {
      await new Event(validEventData).save();
      const duplicate = new Event(validEventData);
      await expect(duplicate.save()).rejects.toThrow();
    });
  });

  describe('Date and Time Normalization', () => {
    it('should normalize date to ISO format', async () => {
      const event = new Event({ ...validEventData, date: '2024-12-15' });
      const saved = await event.save();
      expect(saved.date).toBe('2024-12-15');
    });

    it('should throw on invalid date', async () => {
      const event = new Event({ ...validEventData, date: 'invalid' });
      await expect(event.save()).rejects.toThrow('Invalid date format');
    });

    it('should normalize 24-hour time', async () => {
      const event = new Event({ ...validEventData, time: '09:00' });
      const saved = await event.save();
      expect(saved.time).toBe('09:00');
    });

    it('should convert 12-hour AM to 24-hour', async () => {
      const event = new Event({ ...validEventData, time: '9:00 AM' });
      const saved = await event.save();
      expect(saved.time).toBe('09:00');
    });

    it('should convert 12-hour PM to 24-hour', async () => {
      const event = new Event({ ...validEventData, time: '2:30 PM' });
      const saved = await event.save();
      expect(saved.time).toBe('14:30');
    });

    it('should handle noon correctly', async () => {
      const event = new Event({ ...validEventData, time: '12:00 PM' });
      const saved = await event.save();
      expect(saved.time).toBe('12:00');
    });

    it('should handle midnight correctly', async () => {
      const event = new Event({ ...validEventData, time: '12:00 AM' });
      const saved = await event.save();
      expect(saved.time).toBe('00:00');
    });
  });

  describe('CRUD Operations', () => {
    it('should find by id', async () => {
      const saved = await new Event(validEventData).save();
      const found = await Event.findById(saved._id);
      expect(found?.title).toBe(validEventData.title);
    });

    it('should find by slug', async () => {
      await new Event(validEventData).save();
      const found = await Event.findOne({ slug: 'nextjs-conference-2024' });
      expect(found).toBeDefined();
    });

    it('should update fields', async () => {
      const saved = await new Event(validEventData).save();
      saved.venue = 'Updated';
      const updated = await saved.save();
      expect(updated.venue).toBe('Updated');
    });

    it('should delete', async () => {
      const saved = await new Event(validEventData).save();
      await Event.findByIdAndDelete(saved._id);
      const found = await Event.findById(saved._id);
      expect(found).toBeNull();
    });
  });

  describe('Timestamps', () => {
    it('should auto-generate timestamps', async () => {
      const saved = await new Event(validEventData).save();
      expect(saved.createdAt).toBeInstanceOf(Date);
      expect(saved.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const saved = await new Event(validEventData).save();
      const original = saved.updatedAt;
      await new Promise(r => setTimeout(r, 100));
      saved.title = 'Updated';
      const updated = await saved.save();
      expect(updated.updatedAt.getTime()).toBeGreaterThan(original.getTime());
    });
  });
});