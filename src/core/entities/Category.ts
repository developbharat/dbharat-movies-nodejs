import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./Movie";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @OneToMany(() => Movie, mov => mov.category)
  movies?: Movie[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
