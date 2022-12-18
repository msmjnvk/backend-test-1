import { Date, Schema } from 'mongoose';
import Entity, { ID } from './Entity';
import User from './User';

export default class BlogPost extends Entity {
  title: string;
  description: string;
  date_time: Date;
  authors: [User];

  constructor({
    id,
    title,
    description,
    date_time,
    authors,
  }: {
    id?: ID,
    title: string,
  description: string,
  date_time: Date,
  authors: [User],
  }) {
    super({ id });
    this.title = title;
    this.description = description;
    this.date_time = date_time;
    this.authors = authors;
  }
};
