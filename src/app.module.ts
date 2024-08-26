import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://taikhoanrac741:d7WDowD8a5HuYGb7@cluster0.n1tk5.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
