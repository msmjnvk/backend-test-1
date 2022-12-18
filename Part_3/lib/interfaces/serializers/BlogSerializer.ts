import BlogPost from "../../domain/entities/BlogPost";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import Serializer from "./Serializer";

export default class BlogSerializer extends Serializer {
  _serializeSingleEntity(entity: BlogPost, serviceLocator: ServiceLocator): object {
    const blogObj = {
      'id': entity.id,
      'title': entity.title,
      'description': entity.description,
      'date_time': entity.date_time,
    };
    return blogObj;
  }
};
