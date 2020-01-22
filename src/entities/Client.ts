import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";


@Entity("Client" )
export class Client {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idClient"
        })
    idClient:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"nomClient"
        })
    nomClient:string;
    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"prenomClient"
        })
    prenomClient:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"adresseClient"
        })
    adresseClient:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:13,
        name:"numTelClient"
        })
    numTelClient:string;
        

   
    @OneToMany(()=>Reservation, (Reservation: Reservation)=>Reservation.clientIdClient,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    reservations:Reservation[];
    
}
