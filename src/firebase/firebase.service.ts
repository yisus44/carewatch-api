import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
@Injectable()
export class FirebaseService {
  private fcm: admin.messaging.Messaging;
  constructor() {
    // Initialize Firebase Admin SDK
    const serviceAccount = path.join(__dirname, 'serviceAccount.json'); // Replace with your service account key path
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.fcm = admin.messaging();
  }
  async create(deviceId: string, title: string, body: string) {
    try {
      const message = {
        data: {
          title,
          body,
        },
        token: deviceId,
      };

      // Send a message to the device corresponding to the provided
      // registration token.
      await this.fcm.send(message);

      console.log('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
