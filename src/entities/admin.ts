import { Entity } from "typeorm";
import { Person } from "./person";

@Entity("admin")
export class Admin extends Person {}
