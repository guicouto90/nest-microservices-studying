import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  public async uploadArquivoS3(file: any, id: string) {
    const s3 = new S3({
      region: process.env.S3_BUCKET_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });

    const fileExtesion = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtesion}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: urlKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await s3.upload(params).promise();
    return {
      url: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${urlKey}`,
    };
  }
}
