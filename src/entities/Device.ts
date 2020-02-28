import {Entity, Column} from "typeorm";

@Entity("Device" )
export class Device {
    @Column("varchar",{ 
        nullable:false,
        length:50,
        primary: true,
        name:"deviceid"
        })
    deviceid:string;
    @Column("bool",{ 
        nullable:true,
        name:"authorized"
        })
    authorized:boolean;

    @Column("varchar",{ 
        nullable:true,
        length: 50,
        name:"utilisateur"
        })
    utilisateur:string|null;
    @Column("varchar",{ 
        nullable:true,
        length: 50,
        name:"email"
        })
    email:string|null;

    @Column("varchar",{ 
        nullable:false,
        length: 100,
        name:"information"
        })
    information:string;
    @Column("varchar",{ 
        nullable:true,
        length: 256,
        name:"description"
        })
    description:string;
}
