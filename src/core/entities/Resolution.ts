import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "./Movie";

@Entity("resolutions")
export class Resolution {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  res_720p?: string;

  @Column({ nullable: true })
  res_1080p?: string;

  @Column({ nullable: true })
  res_480p?: string;

  @Column({ nullable: true })
  res_360p?: string;

  @OneToOne(() => Movie, mov => mov.resolution, { nullable: false })
  movie?: Movie;

  @Column({ nullable: false })
  movieId?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
