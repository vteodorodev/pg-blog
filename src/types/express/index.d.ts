// Extend the Request interfaceso we can add a userId to it if needed

import express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
