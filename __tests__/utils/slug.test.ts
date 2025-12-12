import {
  generateSlug,
  generateUniqueSlug,
  generateTourLeaderSlug
} from '@/utils/slug';

describe('slug utilities', () => {
  describe('generateSlug', () => {
    it('should convert text to lowercase', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
      expect(generateSlug('UPPERCASE')).toBe('uppercase');
    });

    it('should replace spaces with hyphens', () => {
      expect(generateSlug('hello world')).toBe('hello-world');
      expect(generateSlug('hello  world')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello, World!')).toBe('hello-world');
      expect(generateSlug('Test@#$%123')).toBe('test123');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(generateSlug(' hello ')).toBe('hello');
      expect(generateSlug('-hello-')).toBe('hello');
    });

    it('should replace underscores with hyphens', () => {
      expect(generateSlug('hello_world')).toBe('hello-world');
    });

    it('should handle empty strings', () => {
      expect(generateSlug('')).toBe('');
    });

    it('should handle strings with only special characters', () => {
      expect(generateSlug('!@#$%')).toBe('');
    });
  });

  describe('generateUniqueSlug', () => {
    it('should return base slug if not in existing slugs', () => {
      const result = generateUniqueSlug('hello-world', ['foo', 'bar']);
      expect(result).toBe('hello-world');
    });

    it('should append -1 if slug exists', () => {
      const result = generateUniqueSlug('hello', ['hello', 'world']);
      expect(result).toBe('hello-1');
    });

    it('should increment number until unique', () => {
      const result = generateUniqueSlug('test', ['test', 'test-1', 'test-2']);
      expect(result).toBe('test-3');
    });

    it('should handle empty existing slugs array', () => {
      const result = generateUniqueSlug('hello', []);
      expect(result).toBe('hello');
    });
  });

  describe('generateTourLeaderSlug', () => {
    it('should generate slug from name', async () => {
      const checkExisting = jest.fn().mockResolvedValue(false);
      const result = await generateTourLeaderSlug('John Doe', checkExisting);
      expect(result).toBe('john-doe');
      expect(checkExisting).toHaveBeenCalledWith('john-doe');
    });

    it('should append number if slug exists', async () => {
      const checkExisting = jest.fn()
        .mockResolvedValueOnce(true) // 'john-doe' exists
        .mockResolvedValueOnce(false); // 'john-doe-1' doesn't exist

      const result = await generateTourLeaderSlug('John Doe', checkExisting);
      expect(result).toBe('john-doe-1');
    });

    it('should keep incrementing until unique slug found', async () => {
      const checkExisting = jest.fn()
        .mockResolvedValueOnce(true) // 'test' exists
        .mockResolvedValueOnce(true) // 'test-1' exists
        .mockResolvedValueOnce(true) // 'test-2' exists
        .mockResolvedValueOnce(false); // 'test-3' doesn't exist

      const result = await generateTourLeaderSlug('Test', checkExisting);
      expect(result).toBe('test-3');
    });
  });
});
