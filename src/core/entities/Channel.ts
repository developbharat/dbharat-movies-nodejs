import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Collection } from "./Collection";
import { Movie } from "./Movie";
import { User } from "./User";

@Entity("channels")
export class Channel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  summary?: string;

  @OneToMany(() => Movie, mov => mov.channel)
  movies?: Movie[];

  @ManyToOne(() => User, usr => usr.channel)
  user?: User;

  @OneToMany(() => Collection, col => col.channel)
  collections?: Collection[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
