import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  constructor(private readonly awsS3Client: S3) {}
  findAll() {
    return `This action returns all awsS3`;
  }
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
      return await this.awsS3Client.upload(params).promise();
    } catch (e) {
      console.log(e);
    }
  }

  async deleteFile(key: string, bucket = process.env.AWS_S3_BUCKET_FILES) {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    return await this.awsS3Client.deleteObject(params).promise();
  }
}
