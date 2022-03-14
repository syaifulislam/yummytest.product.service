import { Schema, Document } from 'mongoose';

export const ProductsSchema = new Schema({
  name: String,
  sku: String,
  type: String,
  createdBy: String,
  updatedBy: String,
});

export interface Products extends Document {
  readonly name: String;
  readonly sku: String;
  readonly type: String;
  readonly createdBy: String;
  readonly updatedBy: String;
}