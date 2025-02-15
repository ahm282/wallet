import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppService } from './app.service';
import { GoalsModule } from './goals/goals.module';

const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/wallet';

@Module({
  imports: [
    GoalsModule,
    MongooseModule.forRoot(CONNECTION_STRING, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected'));
        connection.on('open', () => console.log('open'));
        connection.on('disconnected', () => console.log('disconnected'));
        connection.on('reconnected', () => console.log('reconnected'));
        connection.on('disconnecting', () => console.log('disconnecting'));

        return connection;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
