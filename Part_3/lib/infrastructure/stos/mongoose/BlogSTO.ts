import BlogPost from '../../../domain/entities/BlogPost';

export default (schemaEntity: any): BlogPost | null => {
  if (!schemaEntity) return null;
  return new BlogPost({
    id: schemaEntity.referenceId,
    title: schemaEntity.title,
    description: schemaEntity.description,
    date_time: schemaEntity.date_time,
    authors: [schemaEntity.authors]
  });
};
