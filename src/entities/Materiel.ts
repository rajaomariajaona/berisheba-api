import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("Materiel" )
export class Materiel {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idMateriel"
        })
    idMateriel:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"nomMateriel"
        })
    nomMateriel:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"nbStock"
        })
    nbStock:number | null;
        

   
    @ManyToMany(()=>Reservation, (Reservation: Reservation)=>Reservation.materiels)
    reservations:Reservation[];
    
}
