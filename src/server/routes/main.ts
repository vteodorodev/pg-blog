import { Router } from 'express';
import { countPosts, getPosts } from '../pg/Post';

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
  const perPage = 2;
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

module.exports = router;
