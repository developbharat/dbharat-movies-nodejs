import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Category } from "./Category";
import { Channel } from "./Channel";
import { Collection } from "./Collection";
import { Resolution } from "./Resolution";
import { User } from "./User";

@Entity("movies")
export class Movie {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  plot?: string;

  @Column({ type: "text" })
  filename: string;

  @Column({ type: "text" })
  mimetype: string;

  @Column({ type: "text" })
  originalName: string;

  @Column({ type: "text" })
  filesize: string;

  @Column({ type: "float", default: 0.0 })
  rating?: number;

  @ManyToOne(() => Category, (cat) => cat.movies, { eager: true, nullable: true })
  @JoinColumn()
  category!: Category;

  @Column({ nullable: true })
  categoryId?: number;

  @OneToOne(() => Resolution, (res) => res.movie, { eager: true })
  @JoinColumn()
  resolution?: Resolution;

  @Column({ nullable: true })
  resolutionId: number;

  @ManyToOne(() => Channel, (ch) => ch.movies)
  channel?: Channel;

  @Column({ nullable: true })
  channelId?: number;

  @ManyToOne(() => Collection, (col) => col.movies)
  collection?: Collection;

  @Column({ nullable: true })
  collectionId?: number;

  @ManyToOne(() => User, (usr) => usr.movies)
  user: User;

  @Column({ default: false })
  isPublished?: boolean;

  @Column({ default: true })
  isPublic?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
