import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export function signAccessToken(payload) {
    return jwt.sign(payload, config.jwtAccessSecret, {
        expiresIn: `${config.jwtAccessTtlMinutes}m`
    });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: `${config.jwtRefreshTtlDays}d`
    });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, config.jwtAccessSecret);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, config.jwtRefreshSecret);
}
