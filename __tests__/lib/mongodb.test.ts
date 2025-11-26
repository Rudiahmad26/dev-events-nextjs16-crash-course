import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: { readyState: 0 },
}));

describe('MongoDB Connection', () => {
  const originalEnv = process.env;
  const mockInstance = {} as typeof mongoose;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    (global as any).mongoose = undefined;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should connect with valid URI', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    (mongoose.connect as jest.Mock).mockResolvedValue(mockInstance);
    const result = await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/test', { bufferCommands: false });
    expect(result).toBe(mockInstance);
  });

  it('should throw without MONGODB_URI', async () => {
    delete process.env.MONGODB_URI;
    await expect(connectDB()).rejects.toThrow('Please define the MONGODB_URI');
  });

  it('should cache connection', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    (mongoose.connect as jest.Mock).mockResolvedValue(mockInstance);
    await connectDB();
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it('should reset promise on error', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    (mongoose.connect as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce(mockInstance);
    await expect(connectDB()).rejects.toThrow('Failed');
    const result = await connectDB();
    expect(mongoose.connect).toHaveBeenCalledTimes(2);
    expect(result).toBe(mockInstance);
  });

  it('should handle Atlas URI', async () => {
    process.env.MONGODB_URI = 'mongodb+srv://user:pass@cluster.net/db';
    (mongoose.connect as jest.Mock).mockResolvedValue(mockInstance);
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith('mongodb+srv://user:pass@cluster.net/db', expect.any(Object));
  });
});