import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Ustensile} from "./Ustensile";
import {Reservation} from "./Reservation";


@Entity("Abime" )
@Index("fk_Ustensile_has_Reservation1_Reservation1",["reservationIdReservation",])
export class Abime {

   
    @ManyToOne(()=>Ustensile, (Ustensile: Ustensile)=>Ustensile.rendres,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Ustensile_idUstensile'})
    ustensileIdUstensile:Ustensile;


   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.rendres,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation;        

    @Column("int",{ 
        nullable:false,
        name:"nbAbime"
        })
    nbAbime:number;
        
}
