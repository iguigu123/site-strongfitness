import { env } from './env';

export default {
  jwt: {
    secret: env.APP_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshTokenExpiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    refreshTokenExpiresInDays: env.REFRESH_TOKEN_EXPIRES_IN_DAYS,
  },
};
