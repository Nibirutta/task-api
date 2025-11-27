const origins: string = process.env.ORIGINS ?? '';

export const allowedOrigins = origins.split(',');
