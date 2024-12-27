import type { NextFunction, Request, Response } from 'express';

import {
  type PrivateKey,
  type Secret,
  type PublicKey,
  sign,
  verify,
} from 'jsonwebtoken';
import { ServerError } from './errors';
import type { UserDto } from './models/UserDto';

const jwtSecret = process.env.JWT_SECRET as Secret;

interface AuthRequest extends Request {
  userId: number | undefined;
}

export const authMiddleware = (
  expressRequest: Request,
  res: Response,
  next: NextFunction,
) => {
  // Is this the best way to add the token to the request?
  const req = expressRequest as AuthRequest;
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json(new ServerError(ServerError.UNAUTHORIZED));
    return;
  }

  try {
    const decoded = verify(token, jwtSecret) as UserDto;

    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json(new Error(ServerError.UNAUTHORIZED));
  }
};
