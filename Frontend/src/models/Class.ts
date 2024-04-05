import { IsNotEmpty, Length, Max } from 'class-validator';

export class Class {
  id:number|undefined;

  @Length(1, 50, { message: 'Name must be from $constraint1 to $constraint2 characters' })
  @IsNotEmpty({ message: 'Name is Required' })
  name='';

  @Length(1, 50, { message: 'Category must be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Category is required' })
  category='';

  @Max(999, { message: 'Health must be at most $constraint1' })
  @IsNotEmpty({ message: 'Health is required' })
  baseHealth:number|undefined;

  @Max(999, { message: 'Speed should be at most $constraint1' })
  @IsNotEmpty({ message: 'Speed is required' })
  baseSpeed:number|undefined;
}
