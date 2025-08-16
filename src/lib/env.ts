import { z } from 'zod';

// Environment variable schema validation
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // JWT Security
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  
  // Email Configuration
  EMAIL_PROVIDER: z.enum(['resend', 'smtp']).default('smtp'),
  ADMIN_EMAIL: z.string().email('Invalid admin email format'),
  
  // Resend (conditional)
  RESEND_API_KEY: z.string().optional(),
  
  // SMTP (conditional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email('Invalid SMTP from email').optional(),
  
  // Application
  NEXT_PUBLIC_APP_NAME: z.string().default('Otter Trip'),
  APP_BASE_URL: z.string().url('Invalid APP_BASE_URL format').default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    
    // Additional conditional validation
    if (env.EMAIL_PROVIDER === 'resend' && !env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is required when EMAIL_PROVIDER is "resend"');
    }
    
    if (env.EMAIL_PROVIDER === 'smtp') {
      const requiredSmtpFields = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_FROM'];
      const missingFields = requiredSmtpFields.filter(field => !env[field as keyof typeof env]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required SMTP fields: ${missingFields.join(', ')}`);
      }
    }
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map((err: z.ZodIssue) => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      
      throw new Error(`Environment validation failed:\n${formattedErrors}`);
    }
    throw error;
  }
}

// Export validated environment
export const env = validateEnv();

// Type-safe environment access
export type Environment = z.infer<typeof envSchema>;