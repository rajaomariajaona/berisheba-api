import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Constituer} from "./Constituer";


@Entity("DemiJournee" )
@Index("lol",["TypeDemiJournee","date",],{unique:true})
export class DemiJournee {

    @Column("date",{ 
        primary: true,
        nullable:false,
        name:"date",
        unique: true
        })
    date:DateConstructor;
        

    @Column("varchar",{ 
        primary: true,
        nullable:false,
        length:20,
        unique: true,
        name:"TypeDemiJournee"
        })
    TypeDemiJournee:string;
        

   
    @OneToMany(()=>Constituer, (Constituer: Constituer)=>Constituer.demiJourneeDate,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    constituers:Constituer[];
    

   
    @OneToMany(()=>Constituer, (Constituer: Constituer)=>Constituer.demiJourneeTypeDemiJournee,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    constituers2:Constituer[];
    
}
