import { Request, Response } from 'express';
import { ValidationError } from 'joi';
import GetBlogPost from '../../application/use_cases/blog/GetBlogPost';
import AddBlog from '../../application/use_cases/blog/AddBlog';
import DeleteUser from '../../application/use_cases/user/DeleteUser';
import { ServiceLocator } from '../../infrastructure/config/service-locator';
import UpdateBlogPost from '../../application/use_cases/blog/UpdateBlogPost';

export default {

  //Get Blog Post Based on post_id
  async getBlogPost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;
    // Input
    const blogPostId = request.params.id;
    // Treatment
    let blogPost = null;
    try {
        blogPost = await GetBlogPost(blogPostId, serviceLocator);
    } catch (err) {
      console.log(err);
    }
    // Output
    if (!blogPost) {
      return response.status(404).json({ message: 'Not Found' });
    }
    const output = serviceLocator.blogSerializer.serialize(blogPost, serviceLocator);
    return response.json(output);
  },

  async addBlogPost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;
    // ---------------------------------------------
    // THIS IS HOW TO ACCESS userId FROM AccessToken
    // ---------------------------------------------
    const userId = request.userId;
    // ---------------------------------------------
    // ---------------------------------------------
    // Input
    let data = request.body;
    data = {
        title: data.title,
        description: data.description,
        date_time: data.date_time,
        main_image: data.main_image,
    };
    let blog = null;
    let error = null;
    try {
        blog = await AddBlog(data,userId, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        error = err.message;
      }
    }
    // Output
    if (!blog) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.blogSerializer.serialize(blog, serviceLocator);
    return response.status(201).json(output);
  },

  async updateBlogPost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const referenceId = request.params.id;
    const inputData = request.body;
    const data: any = {
      id: referenceId
    };
    const acceptedFields: string[][] = [
      ['title', 'titile'],
      ['description', 'description'],
      ['date_time'],
    ];
    acceptedFields.forEach((acceptedField) => {
      if (inputData[acceptedField[0]] === undefined) return;
      data[acceptedField.length > 1
        ? acceptedField[1]
        : acceptedField[0]
      ] = inputData[acceptedField[0]];
    });

    // Treatment
    let blogPost = null;
    let error = null;
    try {
        blogPost = await UpdateBlogPost(data, serviceLocator);
    } catch (err) {
      if (err instanceof ValidationError) {
        error = err.details[0].message;
      } else if (err instanceof Error) {
        // 'Error occurred while creating user'
        error = err.message;
      }
    }

    // Output
    if (!blogPost) {
      return response.status(400).json({ message: error });
    }
    const output = serviceLocator.blogSerializer.serialize(blogPost, serviceLocator);
    return response.json(output);
  },

  async deleteBlogPost(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!;

    // Input
    const referanceId = request.params.id;

    // Treatment
    let blog = null;
    try {
        blog = await DeleteUser(referanceId, serviceLocator);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err);
      }
    }

    // Output
    if (!blog) {
      return response.status(404).json({ message: 'Not Found' });
    }
    return response.sendStatus(204);
  },

};
