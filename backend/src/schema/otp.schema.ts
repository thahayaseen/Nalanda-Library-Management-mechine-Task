import { z } from "zod";

export const otpSchema = z.object({
  otp: z.string()
    .trim()
    .length(6, 'OTP should be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
    
  userId: z.string().trim().min(1, 'User ID is required')
});
