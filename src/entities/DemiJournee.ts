import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Constituer} from "./Constituer";


@Entity("DemiJournee" ,{schema:"Berisheba" } )
export class DemiJournee {

    @Column("date",{ 
        nullable:false,
        primary:true,
        name:"date"
        })
    date:string;
        

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:20,
        name:"TypeDemiJournee"
        })
    TypeDemiJournee:string;
        

   
    @OneToMany(()=>Constituer, (Constituer: Constituer)=>Constituer.demiJourneeDate,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    constituers:Constituer[];
    

   
    @OneToMany(()=>Constituer, (Constituer: Constituer)=>Constituer.demiJourneeTypeDemiJournee,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    constituers2:Constituer[];
    
}
