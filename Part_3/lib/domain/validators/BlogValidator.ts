import Joi from 'joi';

export default Joi.object({
  title: Joi.string()
    .label('title')
    .min(5)
    .max(50)
    .required(),

  description: Joi.string()
    .label('description')
    .max(500)
    .required(),

  date_time: Joi.date()
    .label('date_time')
    .required(),

}).unknown();
