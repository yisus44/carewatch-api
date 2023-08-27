import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  constructor(private readonly awsS3Client: S3Client) {}

  async upload(
    file: Express.Multer.File,
    bucket = process.env.AWS_S3_BUCKET_FILES,
  ) {
    const params = {
      Bucket: bucket,
      Key: Date.now() + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      const command = new PutObjectCommand(params);
      const response = await this.awsS3Client.send(command);

      const responseData = {
        ETag: response.ETag,
        ServerSideEncryption: response.ServerSideEncryption,
        Location: `https://${
          params.Bucket
        }.s3.amazonaws.com/${encodeURIComponent(params.Key)}`,
        key: params.Key,
        Key: params.Key,
        Bucket: params.Bucket,
      };

      return responseData;
    } catch (e) {
      console.error('Error uploading file:', e);
    }
  }

  async deleteFile(key: string, bucket = process.env.AWS_S3_BUCKET_FILES) {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    try {
      const command = new DeleteObjectCommand(params);
      return await this.awsS3Client.send(command);
    } catch (e) {
      console.error('Error deleting file:', e);
    }
  }
}
