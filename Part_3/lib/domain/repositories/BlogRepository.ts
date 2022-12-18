import { ID } from "../entities/Entity";
import BlogPost from "../entities/BlogPost";

export default interface BlogRepository {
  persist(domainEntity: BlogPost): Promise<BlogPost | null>;

  merge(domainEntity: BlogPost): Promise<BlogPost | null>;

  remove(entityId: ID): Promise<boolean | null>;

  get(entityId: ID): Promise<BlogPost | null>;

  find(): Promise<BlogPost[]>;
};
