import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Channel } from "./Channel";
import { Movie } from "./Movie";
import { User } from "./User";

@Entity("collections")
export class Collection {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  summary?: string;

  @OneToMany(() => Movie, (mov) => mov.collection)
  movies?: Movie[];

  @ManyToOne(() => Channel, (ch) => ch.collections)
  channel?: Channel;

  @ManyToOne(() => User, (usr) => usr.collections)
  user?: User;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  channelId?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
