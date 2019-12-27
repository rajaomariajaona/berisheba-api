import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("Materiels" )
export class Materiels {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idMateriels"
        })
    idMateriels:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"nomMateriels"
        })
    nomMateriels:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"nbStock"
        })
    nbStock:number | null;
        

   
    @ManyToMany(()=>Reservation, (Reservation: Reservation)=>Reservation.materielss)
    reservations:Reservation[];
    
}
