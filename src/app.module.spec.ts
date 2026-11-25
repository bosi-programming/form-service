import mongoose from 'mongoose';
import './app.module';

describe('AppModule', () => {
  it('should turn on sanitizeFilter for every query', () => {
    expect(mongoose.get('sanitizeFilter')).toBe(true);
  });
});
