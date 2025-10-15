import { z } from 'zod';
export const CameraSchema = z.object({ x: z.number(), y: z.number(), z: z.number(), theta: z.number(), phi: z.number() });
