import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";
import {DemiJournee} from "./DemiJournee";


@Entity("Constituer" )
export class Constituer {

   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.constituers,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation;


    @Column("int",{ 
        nullable:false,
        name:"nbPersonne"
        })
    nbPersonne:number;
        

   
    @ManyToOne(()=>DemiJournee, (DemiJournee: DemiJournee)=>DemiJournee,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' ,eager : true})
    @JoinColumn([{ name:'DemiJournee_date', referencedColumnName: "date"}, { name:'DemiJournee_TypeDemiJournee', referencedColumnName: "TypeDemiJournee"}])
    demiJournee:DemiJournee;

}
