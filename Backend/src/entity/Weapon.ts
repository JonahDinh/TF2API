import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsEmpty, IsInt, IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator'

@Entity()
export class Weapon {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(1, 50, { message: 'Name should be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Name is required' })
    name: string

  @Column({ type: 'varchar', length: 10, nullable: false })
  @Length(3, 10, { message: 'The slot should be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Slot is required' })
    slot: string

  @Column({ type: 'int', width: 4, nullable: false })
  @IsInt({ message: 'Damage done should be an integer' })
  @Max(500, { message: 'The damage for a weapon should be no more than $constraint1 ' })
  @IsNotEmpty({ message: 'Damage is required' })
    damage: number

  @Column({ type: 'int', nullable: false })
  @IsInt({ message: 'Ammo loaded must be an integer' })
  @Min(0, { message: 'Ammo loaded must be greater than or equal to $constraint1' })
    ammoLoaded: number

  @Column({ type: 'int', nullable: false })
  @IsInt({ message: 'Ammo carried must be an integer' })
  @Min(0, { message: 'Ammo carried must be greater than or equal to $constraint1' })
    ammoCarried: number

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @Length(0, 255, { message: 'Special ability length should be less than or equal to 255 characters' })
    specialAbility: string
}
