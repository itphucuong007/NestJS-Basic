
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  description: string;

  @Prop({type: Object})
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({type: Object})
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop({type: Object})
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId,
    email: string
  };

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  deleteAt: Date;

}

export const CompanySchema = SchemaFactory.createForClass(Company);