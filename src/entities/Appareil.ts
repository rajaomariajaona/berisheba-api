import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Utiliser} from "./Utiliser";


@Entity("Appareil" )
export class Appareil {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:50,
        name:"typeAppareil"
        })
    typeAppareil:string;
        

   
    @OneToMany(()=>Utiliser, (Utiliser: Utiliser)=>Utiliser.appareilTypeAppareil,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    utilisers:Utiliser[];
    
}
