
import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImage: z.string().optional(),
  adminInviteToken: z.string().optional(),
});
