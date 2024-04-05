import {
  IsInt, IsNotEmpty, IsOptional, Length, Max, Min,
} from 'class-validator';

export default class Weapon {
  id?: number;

  @Length(1, 50, { message: 'Name should be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  name = '';

  @Length(3, 10, { message: 'The slot should be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Slot is required' })
  slot = '';

  @IsInt({ message: 'Damage done should be an integer' })
  @Max(500, { message: 'The damage for a weapon should be between $constraint1 and $constraint2' })
  @IsNotEmpty({ message: 'Damage is required' })
  damage?: number;

  @IsInt({ message: 'Ammo loaded must be an integer' })
  @Min(0, { message: 'Ammo loaded must be greater than or equal to $constraint1' })
  ammoLoaded?: number;

  @IsInt({ message: 'Ammo carried must be an integer' })
  @Min(0, { message: 'Ammo carried must be greater than or equal to $constraint1' })
  ammoCarried?: number;

  @IsOptional()
  @Length(0, 255, { message: 'Special ability length should be less than or equal to 255 characters' })
  specialAbility?: string = '';
}
