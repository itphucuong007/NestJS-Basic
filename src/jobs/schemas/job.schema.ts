import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {

  @Prop()
  name: string;

  @Prop({ required: true })
  skills: string[];

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId,
    name: string
  };

  @Prop()
  salary: number;

  @Prop()
  quantity: number;

  @Prop({ required: true })
  level: string;

  @Prop()
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  isActive: boolean;
  

}

export const JobSchema = SchemaFactory.createForClass(Job);

