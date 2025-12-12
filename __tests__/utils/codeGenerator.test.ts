import {
  generateConsultationCode,
  validateConsultationCodeFormat,
  generateMultipleConsultationCodes
} from '@/utils/codeGenerator';

describe('codeGenerator', () => {
  describe('generateConsultationCode', () => {
    it('should generate a code in the format OT-####-ABCD', () => {
      const code = generateConsultationCode();
      expect(code).toMatch(/^OT-\d{4}-[A-Z]{4}$/);
    });

    it('should generate unique codes on multiple calls', () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        codes.add(generateConsultationCode());
      }
      // With random generation, we should have mostly unique codes
      expect(codes.size).toBeGreaterThan(90);
    });

    it('should generate codes with exactly 4 digits', () => {
      const code = generateConsultationCode();
      const digits = code.split('-')[1];
      expect(digits).toHaveLength(4);
      expect(digits).toMatch(/^\d{4}$/);
    });

    it('should generate codes with exactly 4 uppercase letters', () => {
      const code = generateConsultationCode();
      const letters = code.split('-')[2];
      expect(letters).toHaveLength(4);
      expect(letters).toMatch(/^[A-Z]{4}$/);
    });
  });

  describe('validateConsultationCodeFormat', () => {
    it('should return true for valid code format XX-####-ABCD', () => {
      expect(validateConsultationCodeFormat('OT-1234-ABCD')).toBe(true);
      expect(validateConsultationCodeFormat('AB-9999-ZZZZ')).toBe(true);
      expect(validateConsultationCodeFormat('XY-0000-TEST')).toBe(true);
    });

    it('should return false for invalid code formats', () => {
      expect(validateConsultationCodeFormat('OT1234ABCD')).toBe(false);
      expect(validateConsultationCodeFormat('OT-123-ABCD')).toBe(false);
      expect(validateConsultationCodeFormat('OT-12345-ABCD')).toBe(false);
      expect(validateConsultationCodeFormat('OT-1234-ABC')).toBe(false);
      expect(validateConsultationCodeFormat('OT-1234-ABCDE')).toBe(false);
      expect(validateConsultationCodeFormat('ot-1234-abcd')).toBe(false);
      expect(validateConsultationCodeFormat('')).toBe(false);
    });

    it('should return false for codes with lowercase letters', () => {
      expect(validateConsultationCodeFormat('ot-1234-ABCD')).toBe(false);
      expect(validateConsultationCodeFormat('OT-1234-abcd')).toBe(false);
    });

    it('should return false for codes with special characters', () => {
      expect(validateConsultationCodeFormat('O@-1234-ABCD')).toBe(false);
      expect(validateConsultationCodeFormat('OT-12#4-ABCD')).toBe(false);
    });
  });

  describe('generateMultipleConsultationCodes', () => {
    it('should generate the requested number of codes', () => {
      const codes = generateMultipleConsultationCodes(5);
      expect(codes).toHaveLength(5);
    });

    it('should generate all unique codes', () => {
      const codes = generateMultipleConsultationCodes(50);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(50);
    });

    it('should return an empty array when count is 0', () => {
      const codes = generateMultipleConsultationCodes(0);
      expect(codes).toHaveLength(0);
    });

    it('should generate valid format codes', () => {
      const codes = generateMultipleConsultationCodes(10);
      codes.forEach(code => {
        expect(code).toMatch(/^OT-\d{4}-[A-Z]{4}$/);
      });
    });
  });
});
