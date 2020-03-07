import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Utiliser} from "./Utiliser";


@Entity("Appareil" )
export class Appareil {
    @PrimaryGeneratedColumn({
        name: "idAppareil"
    })
    idAppareil: number;

    @Column("double precision",{ 
        nullable:false,
        name:"puissance"
        })
    puissance:number;
    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"nomAppareil"
        })
    nomAppareil:string;
        
   
    @OneToMany(()=>Utiliser, (Utiliser: Utiliser)=>Utiliser.appareilIdAppareil,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    utilisers:Utiliser[];
    
}
