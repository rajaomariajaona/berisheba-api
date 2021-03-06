import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("Salle" )
export class Salle {


    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idSalle",
        })
        idSalle:number;

    @Column("varchar",{ 
        unique: true,
        nullable:false,
        length:100,
        name:"nomSalle"
        })
    nomSalle:string;
        

   
    @ManyToMany(()=>Reservation, (Reservation: Reservation)=>Reservation.salles)
    reservations:Reservation[];
    
}
