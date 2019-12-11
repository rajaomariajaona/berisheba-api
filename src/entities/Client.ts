import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("Client" ,{schema:"Berisheba" } )
export class Client {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idClient"
        })
    idClient:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:100,
        name:"nomClient"
        })
    nomClient:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:100,
        name:"adresseClient"
        })
    adresseClient:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:13,
        name:"numTelClient"
        })
    numTelClient:string | null;
        

   
    @OneToMany(()=>Reservation, (Reservation: Reservation)=>Reservation.clientIdClient,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    reservations:Reservation[];
    
}
