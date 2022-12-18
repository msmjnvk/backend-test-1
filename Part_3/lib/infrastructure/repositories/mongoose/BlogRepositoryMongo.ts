import BlogPost from "../../../domain/entities/BlogPost";
import MongooseUser from "../../orm/mongoose/schemas/User";
import BlogRepository from "../../../domain/repositories/BlogRepository";
import BlogSTO from "../../stos/mongoose/BlogSTO";
import { ID } from "../../../domain/entities/Entity";

export default class BlogRepositoryMongo implements BlogRepository {
  async persist(domainEntity: BlogPost): Promise<BlogPost | null> {
    const {
      title,
      description,
      date_time,
      authors
    } = domainEntity;
    const mongooseUser = new MongooseUser({
      title: title,
      description: description,
      date_time: date_time,
      authors,
    });
    await mongooseUser.save();
    return BlogSTO(mongooseUser);
  }

  async merge(domainEntity: BlogPost): Promise<BlogPost | null> {
    const {
      id,
      title,
      description,
      date_time,
      authors
    } = domainEntity;
    const mongooseUser = await MongooseUser.findByIdAndUpdate(
      id,
      {
        title: title,
      description: description,
      date_time: date_time,
      authors,
      },
      {
        new: true,
      }
    );
    return BlogSTO(mongooseUser);
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MongooseUser.findOneAndDelete({ _id: entityId });
  }

  async get(entityId: ID): Promise<BlogPost | null> {
    const mongooseUser = await MongooseUser.findById(entityId);
    if (!mongooseUser) return null;
    return BlogSTO(mongooseUser);
  }

  async find(): Promise<BlogPost[]> {
    const mongooseUsers = await MongooseUser.find().sort({ createdAt: -1 });
    return mongooseUsers
      .map((mongooseUser) => BlogSTO(mongooseUser))
      .filter((blog: BlogPost | null): blog is BlogPost => blog != null);
  }
}
