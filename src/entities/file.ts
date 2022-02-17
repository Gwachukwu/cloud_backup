import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user";

@Entity("file")
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  cloud_id: string;
  
  @Column()
  type: string;

  @Column({
    default: "general",
  })
  folder: string;

  @Column({
    default: true,
  })
  safe: boolean;

  @ManyToOne(() => User, (user) => user.file, {
    nullable: false,
  })
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
