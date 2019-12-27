import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("TypeReservation" )
export class TypeReservation {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:20,
        name:"typeReservation"
        })
    typeReservation:string;
        

   
    @OneToMany(()=>Reservation, (Reservation: Reservation)=>Reservation.typeReservationTypeReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    reservations:Reservation[];
    
}
