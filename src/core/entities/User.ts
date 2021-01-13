import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Channel } from "./Channel";
import { Collection } from "./Collection";
import { Movie } from "./Movie";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  fullname!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "text", select: false })
  password!: string;

  @OneToMany(() => Channel, (ch) => ch.user)
  channel?: Channel[];

  @OneToMany(() => Collection, (ch) => ch.user)
  collections?: Channel[];

  @OneToMany(() => Movie, (mov) => mov.user)
  movies?: Movie[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
