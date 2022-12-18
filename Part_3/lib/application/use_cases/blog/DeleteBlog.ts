import { ID } from '../../../domain/entities/Entity';
import { ServiceLocator } from '../../../infrastructure/config/service-locator';

export default (referenceId: ID, { blogRepository }: ServiceLocator) => blogRepository!.remove(referenceId);
