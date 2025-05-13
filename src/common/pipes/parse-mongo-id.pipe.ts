import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({ value, metadata });
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
      }

    return value.toUpperCase();
  }
}
