import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Autre} from "./Autre";
import {Reservation} from "./Reservation";


@Entity("Doit" )
@Index("fk_Autre_has_Reservation_Reservation1",["reservationIdReservation",])
export class Doit {

   
    @ManyToOne(()=>Autre, (Autre: Autre)=>Autre.doits,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' ,eager: true})
    @JoinColumn({ name:'Autre_idAutre'})
    autreIdAutre:Autre;

    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.doits,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation;
        
}
