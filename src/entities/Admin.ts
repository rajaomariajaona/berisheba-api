import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("Admin")
export class Admin {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "idAdmin"
    })
    idAdmin: number
    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        length: 50,
        name: "username"
    })
    username: string

    @Column({
        type: "varchar",
        nullable: false,
        length: 100,
        name: "password"
    })
    password: string
}
