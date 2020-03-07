import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Abime} from "./Abime";
import {Emprunter} from "./Emprunter";


@Entity("Ustensile" )
export class Ustensile {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idUstensile"
        })
    idUstensile:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:100,
        name:"nomUstensile"
        })
    nomUstensile:string;
        

    @Column("int",{ 
        nullable:true,
        name:"nbTotal"
        })
    nbTotal:number;

    @Column("double precision",{ 
        nullable:true,
        name:"prixUstensile"
        })
    prixUstensile:number;
        

   
    @OneToMany(()=>Abime, (Abime: Abime)=>Abime.ustensileIdUstensile,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    rendres:Abime[];
    

   
    @OneToMany(()=>Emprunter, (Emprunter: Emprunter)=>Emprunter.ustensileIdUstensile,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    emprunters:Emprunter[];
    
}
