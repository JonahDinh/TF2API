import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { IsNotEmpty, Length, Max } from 'class-validator'

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(1, 50, { message: 'Name must be from $constraint1 to $constraint2 characters' })
  @IsNotEmpty({ message: 'Name is Required' })
    name: string

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Length(1, 50, { message: 'Category must be between $constraint1 and $constraint2 characters' })
  @IsNotEmpty({ message: 'Category is required' })
    category: string

  @Column({ type: 'int', width: 4, nullable: false })
  @Max(999, { message: 'Health must be at most $constraint1' })
  @IsNotEmpty({ message: 'Health is required' })
    baseHealth: number

  @Column({ type: 'int', width: 4, nullable: false })
  @Max(999, { message: 'Speed should be at most $constraint1' })
  @IsNotEmpty({ message: 'Speed is required' })
    baseSpeed: number
}
