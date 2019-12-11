import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";
import {Paiement} from "./Paiement";


@Entity("Payer" ,{schema:"Berisheba" } )
@Index("fk_Reservation_has_Paiement_Paiement1",["paiementTypePaiement",])
export class Payer {

   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.payers,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation | null;


   
    @ManyToOne(()=>Paiement, (Paiement: Paiement)=>Paiement.payers,{ primary:true, nullable:false,onDelete: 'NO ACTION',onUpdate: 'NO ACTION' })
    @JoinColumn({ name:'Paiement_typePaiement'})
    paiementTypePaiement:Paiement | null;


    @Column("date",{ 
        nullable:true,
        name:"datePaiement"
        })
    datePaiement:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        name:"sommePayee"
        })
    sommePayee:string | null;
        
}
