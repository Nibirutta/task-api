import { allowedOrigins } from './allowedOrigins';
import { ForbiddenException } from '@nestjs/common';

export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new ForbiddenException('Origin not allowed by CORS policy'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
