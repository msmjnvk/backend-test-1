import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import User from './User';

const schema = new mongoose.Schema({
  title: String,
  description: String,
  date_time: Date,
  author: [{type: Schema.Types.ObjectId,
  ref: 'User'}]}, { timestamps: true });

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

export default mongoose.model('BlogPost', schema);
