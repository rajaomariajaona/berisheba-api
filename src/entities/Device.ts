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
        nullable:false,
        name:"authorized"
        })
    authorized:boolean;
}