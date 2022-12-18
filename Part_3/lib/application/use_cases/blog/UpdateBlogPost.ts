import BlogValidator from '../../../domain/validators/BlogValidator';
import GetBlogPost from './GetBlogPost';
import { ServiceLocator } from '../../../infrastructure/config/service-locator';

export default async (blogData: any, serviceLocator: ServiceLocator) => {
  const { blogRepository } = serviceLocator;
  let blog = await GetBlogPost(blogData.id, serviceLocator);
  if (blog == null) throw new Error('Unknown ID');
  blog = { ...blog, ...blogData };
  await BlogValidator.tailor('update').validateAsync(blog);
  return blogRepository!.merge(blog);
};
