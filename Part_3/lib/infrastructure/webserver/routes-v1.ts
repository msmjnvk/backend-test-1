import { Router } from 'express';

import AuthRoutes from '../../interfaces/routes/v1/auth';
import UsersRoutes from '../../interfaces/routes/v1/users';
import BlogPostsRoutes from '../../interfaces/routes/v1/blogposts';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/users', UsersRoutes);
router.use('/blogs', BlogPostsRoutes);

export default router;
