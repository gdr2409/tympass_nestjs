import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserLoginValidator implements PipeTransform<any> {
	async transform(value, metadata: ArgumentMetadata) {
		const { metatype } = metadata;
		if (!metatype) {
			return value;
		}
		const object = plainToClass(metatype, value);
		const errors = await validate(object);
		if (errors.length) {
			const wrongInputError = new Error('Wrong input');
			throw wrongInputError;
		}
		return object;
	}
}