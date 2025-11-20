import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // (OPTIONAL) Use Cookies instead of LocalStorage
  // res.cookie('jwt', token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',
  //   sameSite: 'strict',
  //   maxAge: 30 * 24 * 60 * 60 * 1000,
  // });

  return token;
};

export default generateToken;