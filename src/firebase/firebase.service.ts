import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Injectable()
export class FirebaseService {
  create() {
    const registrationToken = 'YOUR_REGISTRATION_TOKEN';

    const message = {
      data: {
        score: '850',
        time: '2:45',
      },
      token: registrationToken,
    };

    // Send a message to the device corresponding to the provided
    // registration token.
    // admin
    //   .getMessaging()
    //   .send(message)
    //   .then((response) => {
    //     // Response is a message ID string.
    //     console.log('Successfully sent message:', response);
    //   })
    //   .catch((error) => {
    //     console.log('Error sending message:', error);
    //   });
  }
}
