import { Router } from 'express';

import { compare } from 'bcrypt';

import { type Secret, sign } from 'jsonwebtoken';

import { ServerError } from '../errors';

import { getUserByName } from '../pg/Users';
import { authMiddleware } from '../middlewares';
import type { DecodedToken } from '../types';
import { addPost, editPost, getAllPosts, getPostById } from '../pg/Post';

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
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
    return;
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

    const token = sign({ userId: user.id } as DecodedToken, jwtSecret);

    res.cookie('token', token, { httpOnly: true });

    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
    return;
  }
});

/*
 * GET /
 * Admin Dashboard
 */

router.get('/dashboard', authMiddleware, async (req, res) => {
  const locals = defaultLocals;
  try {
    const data = await getAllPosts();
    res.render('admin/dashboard', { layout: adminLayout, data, locals });
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
  }
});

/*
 * GET /
 * Create Post
 */

router.get('/add-post', authMiddleware, async (req, res) => {
  const locals = { ...defaultLocals, title: 'Add Post' };
  try {
    res.render('admin/add-post', { layout: adminLayout, locals });
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
  }
});

/*
 * POST /
 * Create Post
 */

router.post('/add-post', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { title, body } = req.body;

  if (!userId) {
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
    return;
  }

  try {
    await addPost(title, body, userId);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
  }
});

/*
 * GET /
 * Edit Post
 */

router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  const locals = { ...defaultLocals, title: 'Edit Post' };
  const postId = Number.parseInt(req.params.id as string);

  try {
    const data = await getPostById(postId);

    res.render('admin/edit-post', { layout: adminLayout, locals, data });
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
  }
});

/*
 * PUT /
 * Edit Post
 */

router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const postId = Number.parseInt(req.params.id as string);
  const { title, body } = req.body;

  if (!userId) {
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
    return;
  }

  try {
    await editPost(title, body, postId);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
    res.status(500).json(new Error(ServerError.INTERNAL_ERROR));
  }
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
