import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Rendre} from "./Rendre";
import {Emprunt} from "./Emprunt";


@Entity("Ustensile" ,{schema:"Berisheba" } )
export class Ustensile {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"idUstensile"
        })
    idUstensile:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:100,
        name:"nomUstensile"
        })
    nomUstensile:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        name:"nbDisponible"
        })
    nbDisponible:string | null;
        

   
    @OneToMany(()=>Rendre, (Rendre: Rendre)=>Rendre.ustensileIdUstensile,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    rendres:Rendre[];
    

   
    @OneToMany(()=>Emprunt, (Emprunt: Emprunt)=>Emprunt.ustensileIdUstensile,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    emprunts:Emprunt[];
    
}
