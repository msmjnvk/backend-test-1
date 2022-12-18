import { ID } from '../../../domain/entities/Entity';
import { ServiceLocator } from '../../../infrastructure/config/service-locator';

export default async (blogPostId: ID, { blogRepository }: ServiceLocator) => {
  const blogPost = await blogRepository!.get(blogPostId);
  if (!blogPost) {
    throw new Error('No Such Blogs Found');
  }
  return blogPost;
};
