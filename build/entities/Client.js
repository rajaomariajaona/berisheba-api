"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Reservation_1 = require("./Reservation");
var Client = /** @class */ (function () {
    function Client() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            type: "int",
            name: "idClient"
        }),
        __metadata("design:type", Number)
    ], Client.prototype, "idClient", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: false,
            length: 50,
            name: "nomClient"
        }),
        __metadata("design:type", String)
    ], Client.prototype, "nomClient", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 50,
            name: "prenomClient"
        }),
        __metadata("design:type", String)
    ], Client.prototype, "prenomClient", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 100,
            name: "adresseClient"
        }),
        __metadata("design:type", String)
    ], Client.prototype, "adresseClient", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 13,
            name: "numTelClient"
        }),
        __metadata("design:type", String)
    ], Client.prototype, "numTelClient", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.clientIdClient; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Client.prototype, "reservations", void 0);
    Client = __decorate([
        typeorm_1.Entity("Client")
    ], Client);
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=Client.js.map