import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {Payer} from "./Payer";


@Entity("Paiement" )
export class Paiement {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:20,
        name:"typePaiement"
        })
    typePaiement:string;
        

   
    @OneToMany(()=>Payer, (Payer: Payer)=>Payer.paiementTypePaiement,{ onDelete: 'NO ACTION' ,onUpdate: 'NO ACTION' })
    payers:Payer[];
    
}
