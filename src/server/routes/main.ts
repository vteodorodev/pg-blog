import { Router } from 'express';
import {
  countPosts,
  getPostById,
  getPosts,
  searchPostByString,
} from '../pg/Post';

const router = Router();

const defaultLocals = {
  title: 'NodeJS Blog',
  description: 'Simple blog created with NodeJs and MongoDb',
};

/*
 * GET /
 * HOME
 */

router.get('/', async (req, res) => {
  const locals = defaultLocals;
  const perPage = 5;
  const page = Number.parseInt(req.query.page as string) || 1;

  const offset = (page - 1) * perPage;
  try {
    const data = await getPosts(perPage, offset);

    const nextPage = page + 1;

    const count = await countPosts();

    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

/*
 * GET /
 * Post :id
 */

router.get('/post/:id', async (req, res) => {
  const postId = Number.parseInt(req.params.id as string);

  try {
    const data = await getPostById(postId);
    const locals = { ...defaultLocals, title: data.title };
    console.log(data);
    res.render('post', { locals, data });
  } catch (error) {
    console.log(error);
  }
});

/*
 * GET /
 * Search
 */

router.get('/search', async (req, res) => {
  const locals = defaultLocals;
  const searchTerm = req.query.searchTerm as string;

  try {
    const data = await searchPostByString(searchTerm);
    res.render('search', { locals, data });
  } catch (error) {
    console.log(error);
  }
  // const postId = Number.parseInt(req.params.id as string);

  // try {
  //   const data = await getPostById(postId);
  //   const locals = { ...defaultLocals, title: data.title };
  //   console.log(data);
  //   res.render('post', { locals, data });
  // } catch (error) {
  //   console.log(error);
  // }
});

module.exports = router;
