import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import { signToken } from '../services/token-service.js';

const toAuthResponse = (user) => {
  const token = signToken({ userId: user.id, email: user.email });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next({ status: 400, message: 'name, email and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next({ status: 409, message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json(toAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next({ status: 400, message: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next({ status: 401, message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return next({ status: 401, message: 'Invalid credentials' });
    }

    res.json(toAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req, res) => {
  res.json({ message: 'Logged out on client side. Remove token.' });
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next({ status: 400, message: 'Avatar file is required' });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return next({ status: 404, message: 'User not found' });
    }

    user.avatarUrl = `/static/avatars/${req.file.filename}`;
    await user.save();

    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    next(error);
  }
};
