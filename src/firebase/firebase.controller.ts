import { Body, Controller, Post, Query } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post()
  create(@Body() body: CreateNotificationDto) {
    return this.firebaseService.create(body.deviceId, body.title, body.payload);
  }
}
