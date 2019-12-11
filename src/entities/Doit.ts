import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Autre} from "./Autre";
import {Reservation} from "./Reservation";


@Entity("Doit" ,{schema:"Berisheba" } )
@Index("fk_Autre_has_Reservation_Reservation1",["reservationIdReservation",])
export class Doit {

   
    @ManyToOne(()=>Autre, (Autre: Autre)=>Autre.doits,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Autre_typeAutre'})
    autreTypeAutre:Autre | null;


   
    @ManyToOne(()=>Reservation, (Reservation: Reservation)=>Reservation.doits,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Reservation_idReservation'})
    reservationIdReservation:Reservation | null;


    @Column("double",{ 
        nullable:true,
        precision:22,
        name:"prixAutre"
        })
    prixAutre:number | null;
        

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:100,
        name:"motif"
        })
    motif:string;
        
}
