import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    steamId: string // Unique identifier for the user from Steam

  @Column()
    username: string // The user's display name

  @Column({ nullable: true })
    avatarUrl: string // URL of the user's avatar image
}
