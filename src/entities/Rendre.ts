import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Ustensile} from "./Ustensile";
import {Reservation} from "./Reservation";


@Entity("Rendre" )
@Index("fk_Ustensile_has_Reservation1_Reservation1",["reservationIdReservation",])
export class Rendre {

   
    @ManyToOne(()=>Ustensile, (Ustensile: Ustensile)=>Ustensile.rendres,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Ustensile_idUstensile'})
    ustensileIdUstensile:Ustensile | null;


   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.rendres,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation | null;


    @Column("date",{ 
        nullable:true,
        name:"dateRendue"
        })
    dateRendue:string | null;
        

    @Column("int",{ 
        nullable:true,
        name:"nbRendue"
        })
    nbRendue:number | null;
        
}
