import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Rendre} from "./Rendre";
import {Emprunt} from "./Emprunt";


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
        

   
    @OneToMany(()=>Rendre, (Rendre: Rendre)=>Rendre.ustensileIdUstensile,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    rendres:Rendre[];
    

   
    @OneToMany(()=>Emprunt, (Emprunt: Emprunt)=>Emprunt.ustensileIdUstensile,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    emprunts:Emprunt[];
    
}
