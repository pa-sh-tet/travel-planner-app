import { verifyToken } from '../services/token-service.js';

export const auth = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return next({ status: 401, message: 'Unauthorized' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next({ status: 401, message: 'Invalid token' });
  }
};
