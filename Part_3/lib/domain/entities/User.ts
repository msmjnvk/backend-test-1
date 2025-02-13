import BlogPost from './BlogPost';
import Entity, { ID } from './Entity';

export default class User extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  accessToken?: string;
  blogs:[BlogPost];

  constructor({
    id,
    firstName,
    lastName,
    email,
    phone,
    password,
    accessToken,
    blogs
  }: {
    id?: ID,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    accessToken?: string;
    blogs:[BlogPost];
  }) {
    super({ id });
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.accessToken = accessToken;
    this.blogs = blogs;
  }
};
