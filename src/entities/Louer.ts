import {Entity, ManyToOne, JoinColumn, Column} from "typeorm";
import { Reservation } from './Reservation';
import { Materiel } from './Materiel';

@Entity("Louer" )
export class Louer {
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.constituers,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation;

    @ManyToOne(()=>Materiel, (Materiel: Materiel)=>Materiel.louers,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Materiel_idMateriel'})
    materielIdMateriel:Materiel;

    @Column({
        nullable: false,
        type: "int",
        name: "nbLouee"
    })
    nbLouee: number;
}
