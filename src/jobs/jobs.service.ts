
import { CreateJobDto } from './dto/create-job.dto';
import { Injectable } from '@nestjs/common';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateJobDto } from './dto/update-job.dto';
import mongoose from 'mongoose';

import aqp from 'api-query-params';



@Injectable()
export class JobsService {

  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }


  async create(createJobDto: CreateJobDto, user: IUser) {
    const {
      name, skills, company, salary, quantity,
      level, description, startDate, endDate,
      isActive, location
    } = createJobDto;

    let newJob = await this.jobModel.create({
      name, skills, company, salary, quantity,
      level, description, startDate, endDate,
      isActive, location,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });

    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt
    }

  }


  async update(_id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const updated = await this.jobModel.updateOne(
      { _id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
    return updated;
  }

  async remove(_id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return "not found job";

    await this.jobModel.updateOne(
      { _id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    return this.jobModel.softDelete({
      _id
    })

  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "not found job";

    return await this.jobModel.findById(id);
  }


  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hién tai |
        pageSize: limit, //s6 lugng ban ghi da ldy |
        pages: totalPages, //tdng s6 trang voi didu kién query
        total: totalItems // tng s6 phan tir (sé ban ghi) |

      },
      result //két qua query 

    }
  }

}
