import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Appareil} from "./Appareil";
import {Reservation} from "./Reservation";


@Entity("Utiliser" )
@Index("fk_Appareil_has_Reservation_Reservation1",["reservationIdReservation",])
export class Utiliser {

   
    @ManyToOne(()=>Appareil, (Appareil: Appareil)=>Appareil.utilisers,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Appareil_idAppareil'})
    appareilIdAppareil:Appareil;


   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.utilisers,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation;

    @Column("int",{ 
        nullable:false,
        name:"duree"
        })
    duree:number;
        
}
