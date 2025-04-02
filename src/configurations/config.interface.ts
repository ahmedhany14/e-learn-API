export interface AppConfig {
    port: number;
    env: string;
    apiVersion: string;
    storagePath: string;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    autoLoadEntities: boolean;

    // For MongoDB
    url: string;
}

export interface EmailConfig {
    mailHost: string;
    mailPort: number;
    mailUser: string;
    mailPassword: string;
}

export interface GoogleConfig {
    googleClientId: string;
    googleClientSecret: string;
}

export interface JwtConfig {
    secret: string;
    refreshSecret: string;
    expiresIn: number;
    refreshExpiresIn: number;
    tokenAudience: string;
    tokenIssuer: string;
    reset_token_expires_in: number;
    reset_token_secret: string;
}

export interface RedisConfig {
    port: number;
    host: string;
    password: string;
    ttl: number; // Time to live for regular cache items
    refreshTokenTtl: number; // Specific TTL for refresh tokens (in seconds)
    active_token_expiration: number;
}

export interface StripeConfig {
    secretKey: string;
    publicKey: string;
}


export interface awsConfig {
    bucket_name: string;
    region: string;
    access_key: string;
    secret_key: string;
    cloudfront_url: string;
}

export interface Config {
    app: AppConfig;
    database: DatabaseConfig;
    email: EmailConfig;
    google: GoogleConfig;
    jwt: JwtConfig;
    redis: RedisConfig;
    stripe: StripeConfig;
    aws: awsConfig;
}