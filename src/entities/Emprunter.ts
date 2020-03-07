import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Ustensile} from "./Ustensile";
import {Reservation} from "./Reservation";


@Entity("Emprunter" )
@Index("fk_Ustensile_has_Reservation_Reservation1",["reservationIdReservation",])
export class Emprunter {

   
    @ManyToOne(()=>Ustensile, (Ustensile: Ustensile)=>Ustensile.emprunters,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Ustensile_idUstensile'})
    ustensileIdUstensile:Ustensile;


   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.emprunters,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation;

    @Column("int",{ 
        nullable:false,
        name:"nbEmprunte"
        })
    nbEmprunte:number;
        
}
