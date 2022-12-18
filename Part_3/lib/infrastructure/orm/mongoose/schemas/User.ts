import mongoose from '../mongoose';
import { Schema } from 'mongoose';
import BlogPost from './Blog';

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
    default: null,
  },
  password: String,
  blogs:[{type: Schema.Types.ObjectId,
    ref: "BlogPost"}]
}, { timestamps: true });

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

export default mongoose.model('User', schema);
