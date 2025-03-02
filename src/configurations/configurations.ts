import { Config } from './config.interface';

export default (): Config => ({
    app: {
        port: parseInt(process.env.PORT, 10) || 3000,
        env: process.env.NODE_ENV || 'development',
        apiVersion: process.env.API_VERSION || 'v1',
        storagePath: process.env.STORAGE_PATH,
    },
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
        autoLoadEntities: process.env.DATABASE_AUTO_LOAD_ENTITIES === 'true',
    },
    email: {
        mailHost: process.env.MAIL_HOST,
        mailPort: parseInt(process.env.MAIL_PORT, 10),
        mailUser: process.env.MAIL_USER,
        mailPassword: process.env.MAIL_PASSWORD,
    },
    google: {
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10),
        refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN ?? '86000', 10),
        tokenAudience: process.env.JWT_TOKEN_AUDIENCE,
        tokenIssuer: process.env.JWT_TOKEN_ISSUER,
        reset_token_expires_in: parseInt(process.env.RESET_TOKEN_EXPIRES_IN ?? '300', 10),
        reset_token_secret: process.env.RESET_TOKEN_SECRET,
    },
    redis: {
        port: parseInt(process.env.REDIS_PORT, 10),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PW,
        // expiration time in seconds
        active_token_expiration: parseInt(process.env.REDIS_ACTIVE_TOKEN_EXPIRATION, 10) || 5 * 60, // 5 minutes

        ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
        refreshTokenTtl: parseInt(
            process.env.REDIS_REFRESH_TOKEN_TTL || '604800',
            10,
        ),
    },
});