// import { JobsService } from './jobs.service';
// import { CreateJobDto } from './dto/create-job.dto';

// import { UpdateJobDto } from './dto/update-job.dto';
// import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
// import { IUser } from 'src/users/user.interface';
// import { Public, ResponseMessage, User } from 'src/decorator/customize';


// @Controller('jobs')
// export class JobsController {
//   constructor(private readonly jobsService: JobsService) { }

//   @Post()
//   @ResponseMessage("Create a new job")
//   create(@Body() createlobDto: CreateJobDto, @User() user: IUser) {
//     return this.jobsService.create(createlobDto, user);
//   }

//   @Patch(':id')
//   @ResponseMessage("Update a job")
//   update(
//     @Param('id') id: string,
//     @Body() updateJobDto: UpdateJobDto,
//     @User() user: IUser
//   ) {
//     return this.jobsService.update(id, updateJobDto, user);
//   }



// @Get()
// @ResponseMessage("Fetch jobs with pagination")
// findAll(
//   @Query("current") currentPage: string,
//   @Query("pageSize") limit: string,
//   @Query() gs: string
// ) {
//   return this.jobsService.findAll(+currentPage, +limit, gs);
// }


// @Get(':id')
// @ResponseMessage("Fetch a job by id")
// findOne(@Param('id') id: string) {
//   return this.jobsService.findOne(id);
// }


// @Delete(':id')
// @ResponseMessage("Delete a job")
// remove(@Param('id') id: string, @User() user: IUser) {
//   return this.jobsService.remove(id, user);
// }


// }




import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/user.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

import { Controller, Post, Body, Patch, Param, Delete, Get, Query } from '@nestjs/common';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Create a new job")
  create(@Body() createlobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createlobDto, user);
  }

  @Patch(':id')
  @ResponseMessage("Update a job")
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }


  @Delete(':id')
  @ResponseMessage("Delete a job")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }

  @Get(':id')
  @ResponseMessage("Fetch a job by id")
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Get()
  @ResponseMessage("Fetch jobs with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

}

















