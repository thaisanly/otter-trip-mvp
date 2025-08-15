/**
 * Generate a consultation code in the format OT-####-ABCD
 * where #### is 4 random digits and ABCD is 4 random uppercase letters
 */
export function generateConsultationCode(): string {
  // Generate 4 random digits
  const digits = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Generate 4 random uppercase letters
  const letters = Array.from({ length: 4 }, () => 
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  
  return `OT-${digits}-${letters}`;
}

/**
 * Validate if a code matches the expected format XX-####-ABCD
 * where XX is any 2 uppercase letters, #### is 4 digits, and ABCD is 4 uppercase letters
 */
export function validateConsultationCodeFormat(code: string): boolean {
  const pattern = /^[A-Z]{2}-\d{4}-[A-Z]{4}$/;
  return pattern.test(code);
}

/**
 * Generate multiple unique consultation codes
 */
export function generateMultipleConsultationCodes(count: number): string[] {
  const codes = new Set<string>();
  
  while (codes.size < count) {
    codes.add(generateConsultationCode());
  }
  
  return Array.from(codes);
}