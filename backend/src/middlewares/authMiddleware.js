import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import 'dotenv/config';

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token' });
  }
};

export { protect };