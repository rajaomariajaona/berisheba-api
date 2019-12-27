import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Ustensile} from "./Ustensile";
import {Reservation} from "./Reservation";


@Entity("Emprunt" )
@Index("fk_Ustensile_has_Reservation_Reservation1",["reservationIdReservation",])
export class Emprunt {

   
    @ManyToOne(()=>Ustensile, (Ustensile: Ustensile)=>Ustensile.emprunts,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Ustensile_idUstensile'})
    ustensileIdUstensile:Ustensile | null;


   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.emprunts,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation | null;


    @Column("date",{ 
        nullable:true,
        name:"dateEmprunt"
        })
    dateEmprunt:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"nbEmprunt"
        })
    nbEmprunt:number | null;
        
}
