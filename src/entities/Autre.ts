import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Doit} from "./Doit";


@Entity("Autre" )
export class Autre {
    @PrimaryGeneratedColumn({
        type: "int",
        name: "idAutre",
    })
    idAutre: number;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"motif"
        })
    motif:string;
   
    @OneToMany(()=>Doit, (Doit: Doit)=>Doit.autreIdAutre,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    doits:Doit[];
    
}
