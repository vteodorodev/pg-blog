import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';

import { compare } from 'bcrypt';

import { type Secret, sign } from 'jsonwebtoken';

import { ServerError } from '../errors';

import { getUserByName } from '../pg/Users';
import { authMiddleware } from '../middlewares';

const router = Router();

const adminLayout = '../views/layouts/admin';

const defaultLocals = {
  title: 'Admin',
  description: 'Simple blog created with NodeJs and MongoDb',
};

const jwtSecret = process.env.JWT_SECRET as Secret;

/*
 * GET /
 * Admin
 */

router.get('/admin', async (req, res) => {
  const locals = defaultLocals;
  const usernameError = false;
  try {
    res.render('admin/index', {
      locals,
      layout: adminLayout,
      usernameError,
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * POST /
 * Admin Login
 */

router.post('/admin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByName(username);

    if (!user) {
      res.status(401).json(new ServerError(ServerError.INVALID_CREDENTIALS));
      return;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json(new ServerError(ServerError.INVALID_CREDENTIALS));
      return;
    }

    const token = sign({ userId: user.id }, jwtSecret);

    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).json(new ServerError(ServerError.INTERNAL_ERROR));
  }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  res.render('admin/dashboard', { layout: adminLayout });
});

/*
 * POST /
 * Admin Login
 */

// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const hashedPassword = await hash(password.trim(), 10);

//     try {
//       res.redirect('/admin');
//       await createUser(username, hashedPassword);
//     } catch (error) {
//       if (error instanceof UserError && error.code === UserError.USER_EXISTS) {
//         // res.status(409).json(error);
//         res.render('admin/index', { usernameError: true });
//       } else {
//         res
//           .status(500)
//           .json(new ServerError(ServerError.GENERIC_ERROR_MESSAGE));
//       }
//     }
//   } catch (error) {
//     res.status(500).json(new ServerError(ServerError.GENERIC_ERROR_MESSAGE));
//   }
// });

module.exports = router;
