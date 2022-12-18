import { Router } from 'express';
import BlogController from '../../controllers/BlogController';
import AuthenticationMiddleware from '../../middlewares/AuthenticationMiddleware';

const router = Router();

router.get('/:id', BlogController.getBlogPost);
router.post('/', AuthenticationMiddleware(), BlogController.addBlogPost);
router.patch('/:id', BlogController.updateBlogPost);
router.delete('/:id', AuthenticationMiddleware(), BlogController.deleteBlogPost);

export default router;