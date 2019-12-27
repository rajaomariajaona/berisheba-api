import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";
import {DemiJournee} from "./DemiJournee";


@Entity("Constituer" )
@Index("fk_Constituer_DemiJournee1",["demiJourneeDate","demiJourneeTypeDemiJournee",])
export class Constituer {

   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.constituers,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation | null;


    @Column("int",{ 
        nullable:true,
        name:"nbPersonne"
        })
    nbPersonne:number | null;
        

   
    @ManyToOne(()=>DemiJournee, (DemiJournee: DemiJournee)=>DemiJournee.constituers,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'DemiJournee_date', referencedColumnName: "date"})
    demiJourneeDate:DateConstructor;


   
    @ManyToOne(()=>DemiJournee, (DemiJournee: DemiJournee)=>DemiJournee.constituers2,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'DemiJournee_TypeDemiJournee', referencedColumnName: "TypeDemiJournee"})
    demiJourneeTypeDemiJournee:string;

}
