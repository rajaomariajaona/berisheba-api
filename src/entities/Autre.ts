import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Doit} from "./Doit";


@Entity("Autre" )
export class Autre {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:50,
        name:"typeAutre"
        })
    typeAutre:string;
        

   
    @OneToMany(()=>Doit, (Doit: Doit)=>Doit.autreTypeAutre,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    doits:Doit[];
    
}
