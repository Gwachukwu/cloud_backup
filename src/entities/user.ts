import { Entity, OneToMany } from "typeorm";
import { File } from "./file";
import { Person } from "./person";

@Entity("user")
export class User extends Person {
  @OneToMany(() => File, (file) => file.user)
  file: File[];
}
