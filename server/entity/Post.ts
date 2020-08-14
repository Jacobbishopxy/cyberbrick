/**
 * Created by Jacob Xie on 8/14/2020.
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Category } from "./Category";

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  title?: string;

  @Column("text")
  text?: string

  @ManyToMany(type => Category, { cascade: true })
  @JoinTable()
  categories?: Category[]
}

