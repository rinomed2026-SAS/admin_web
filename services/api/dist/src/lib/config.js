import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: Number(process.env.PORT ?? 4000),
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'change_me_access',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change_me_refresh',
    jwtAccessTtlMinutes: Number(process.env.JWT_ACCESS_TTL_MINUTES ?? 15),
    jwtRefreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? 30),
    corsOrigin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : ['http://localhost:5173', 'http://localhost:8100'],
    appUrl: process.env.APP_URL ?? 'http://localhost:8100'
};
