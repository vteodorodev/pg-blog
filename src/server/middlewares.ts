import type { NextFunction, Request, Response } from 'express';

import { type Secret, verify } from 'jsonwebtoken';
import { ServerError } from './errors';
import type { UserDto } from './models/UserDto';
import type { DecodedToken } from './types';

const jwtSecret = process.env.JWT_SECRET as Secret;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json(new ServerError(ServerError.UNAUTHORIZED));
    return;
  }

  try {
    const decoded = verify(token, jwtSecret) as DecodedToken;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json(new Error(ServerError.UNAUTHORIZED));
  }
};
