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
        nullable:true,
        length:50,
        name:"prenomClient"
        })
    prenomClient:string | null;
        

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
