import BlogPost from '../../../domain/entities/BlogPost';
import UserValidator from '../../../domain/validators/UserValidator';
import { ServiceLocator } from '../../../infrastructure/config/service-locator';

export default async (blogPost: any,userId:any, { blogRepository }: ServiceLocator) => {
  await UserValidator.tailor('add').validateAsync(blogPost);
  const blog = new BlogPost({
    title: blogPost.firstName,
    description: blogPost.description,
    date_time: blogPost.date_time,
    authors: [userId],
  });
  return blogRepository!.persist(blog);
};