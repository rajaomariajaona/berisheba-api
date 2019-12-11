import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("Salle" ,{schema:"Berisheba" } )
export class Salle {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:10,
        name:"idSalle"
        })
    idSalle:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:100,
        name:"nomSalle"
        })
    nomSalle:string | null;
        

   
    @ManyToMany(()=>Reservation, (Reservation: Reservation)=>Reservation.salles)
    reservations:Reservation[];
    
}
