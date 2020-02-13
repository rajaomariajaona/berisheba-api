import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Client} from "./Client";
import {Payer} from "./Payer";
import {Doit} from "./Doit";
import {Abime} from "./Abime";
import {Emprunter} from "./Emprunter";
import {Utiliser} from "./Utiliser";
import {Constituer} from "./Constituer";
import {Salle} from "./Salle";
import {Materiel} from "./Materiel";
import { Louer } from './Louer';


@Entity("Reservation" )
@Index("fk_Reservation_Client",["clientIdClient",])
export class Reservation {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idReservation"
        })
    idReservation:number;
        

    @Column("double precision",{ 
        nullable:false,
        name:"prixPersonne"
        })
    prixPersonne:number ;
        

    @Column("double precision",{ 
        nullable:true,
        name:"prixKW"
        })
    prixKW:number | null;
        

    @Column("boolean",{ 
        nullable:false,
        name:"etatReservation"
        })
    etatReservation:boolean;


    @Column("boolean",{ 
        nullable:false,
        name:"nbPersonneIdentique"
        })
    nbPersonneIdentique:boolean;
        

    @Column("varchar",{ 
        nullable:true,
        name:"descReservation",
        length: 256
        })
    descReservation:string | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"nomReservation"
        })
    nomReservation:string ;
        
    @Column("char",{ 
        nullable:true,
        length:10,
        name:"couleur"
        })
    couleur:string | null;
   
    @ManyToOne(()=>Client, (Client: Client)=>Client.reservations,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'Client_idClient'})
    clientIdClient:Client;

   
    @OneToMany(()=>Payer, (Payer: Payer)=>Payer.reservationIdReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    payers:Payer[];
    

   
    @OneToMany(()=>Doit, (Doit: Doit)=>Doit.reservationIdReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    doits:Doit[];
    

   
    @OneToMany(()=>Abime, (Abime: Abime)=>Abime.reservationIdReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    rendres:Abime[];
    

   
    @OneToMany(()=>Emprunter, (Emprunter: Emprunter)=>Emprunter.reservationIdReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    emprunters:Emprunter[];
    

   
    @OneToMany(()=>Utiliser, (Utiliser: Utiliser)=>Utiliser.reservationIdReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    utilisers:Utiliser[];
    

   
    @OneToMany(()=>Constituer, (Constituer: Constituer)=>Constituer.reservationIdReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    constituers:Constituer[];
    

   
    @ManyToMany(()=>Salle, (Salle: Salle)=>Salle.reservations,{  nullable:false, })
    @JoinTable({ name:'Concerner'})
    salles:Salle[];
    

   
    @OneToMany(()=>Louer, (Louer: Louer)=>Louer.reservationIdReservation,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    Louers:Louer[];
    
}
