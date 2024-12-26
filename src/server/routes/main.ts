import { Router } from 'express';

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
  res.render('index', locals);
});

module.exports = router;
