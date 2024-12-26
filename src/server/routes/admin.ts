import { Router } from 'express';

import { hash } from 'bcrypt';

import { UserError, ServerError } from '../errors';

import {
  countPosts,
  getPostById,
  getPosts,
  searchPostByString,
} from '../pg/Post';
import { createUser } from '../pg/Users';

const router = Router();

const adminLayout = '../views/layouts/admin';

const defaultLocals = {
  title: 'Admin',
  description: 'Simple blog created with NodeJs and MongoDb',
};

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
  try {
    const { username, password } = req.body;
    console.log(req.body);
  } catch (error) {
    console.log(error);
  }
});

/*
 * POST /
 * Admin Login
 */

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await hash(password.trim(), 10);

    try {
      await createUser(username, hashedPassword);
    } catch (error) {
      if (error instanceof UserError && error.code === UserError.USER_EXISTS) {
        // res.status(409).json(error);
        res.render('admin/index', { usernameError: true });
      } else {
        res
          .status(500)
          .json(new ServerError(ServerError.GENERIC_ERROR_MESSAGE));
      }
    }
  } catch (error) {
    res.status(500).json(new ServerError(ServerError.GENERIC_ERROR_MESSAGE));
  }
});

module.exports = router;
