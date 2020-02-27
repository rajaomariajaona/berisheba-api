import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("User" )
export class User {

    @Column({
        primary: true,
        type:"varchar", 
        length:50,
        name:"username"
    })
    username:string;
    
    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"email"
        })
    email:string;

    @Column("varchar",{ 
        nullable:true,
        length:6,
        name:"forgetCode"
        })
    forgetCode:string;

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"password"
        })
    password:string;
}
