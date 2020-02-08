import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Reservation} from "./Reservation";
import { Louer } from './Louer';


@Entity("Materiel" )
export class Materiel {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idMateriel"
        })
    idMateriel:number;        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"nomMateriel"
        })
    nomMateriel:string;
        

    @Column("int",{ 
        nullable:false,
        name:"nbStock"
        })
    nbStock:number;
        

   
    @OneToMany(()=>Louer, (Louer: Louer)=>Louer.materielIdMateriel)
    louers:Louer[];
    
}
