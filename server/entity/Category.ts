/**
 * Created by Jacob Xie on 8/14/2020.
 */

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name?: string;
}
