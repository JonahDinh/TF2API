import {
  IsNotEmpty, Length, IsOptional, Max,
} from 'class-validator';

export default class Map {
  id:number|undefined;

  @Length(1, 100, { message: 'Name must be from $constraint1 to $constraint2 characters' })
  @IsNotEmpty({ message: 'Name is Required' })
  name=' ';

  @Length(1, 50, { message: 'Category must be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Category is required' })
  type=' ';

  @IsOptional()
  @Max(50, { message: 'The setting must be between $constraint1 characters' })
  setting=' ';
}
