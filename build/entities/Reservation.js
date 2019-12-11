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
var Client_1 = require("./Client");
var TypeReservation_1 = require("./TypeReservation");
var Payer_1 = require("./Payer");
var Doit_1 = require("./Doit");
var Rendre_1 = require("./Rendre");
var Emprunt_1 = require("./Emprunt");
var Utiliser_1 = require("./Utiliser");
var Constituer_1 = require("./Constituer");
var Salle_1 = require("./Salle");
var Materiels_1 = require("./Materiels");
var Reservation = /** @class */ (function () {
    function Reservation() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            type: "int",
            name: "idReservation"
        }),
        __metadata("design:type", Number)
    ], Reservation.prototype, "idReservation", void 0);
    __decorate([
        typeorm_1.Column("double", {
            nullable: true,
            precision: 22,
            name: "prixPersonne"
        }),
        __metadata("design:type", Number)
    ], Reservation.prototype, "prixPersonne", void 0);
    __decorate([
        typeorm_1.Column("double", {
            nullable: true,
            precision: 22,
            name: "prixKW"
        }),
        __metadata("design:type", Number)
    ], Reservation.prototype, "prixKW", void 0);
    __decorate([
        typeorm_1.Column("tinyint", {
            nullable: true,
            name: "etatReservation"
        }),
        __metadata("design:type", Number)
    ], Reservation.prototype, "etatReservation", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            name: "descReservation",
            length: 256
        }),
        __metadata("design:type", String)
    ], Reservation.prototype, "descReservation", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 100,
            name: "nomReservation"
        }),
        __metadata("design:type", String)
    ], Reservation.prototype, "nomReservation", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Client_1.Client; }, function (Client) { return Client.reservations; }, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Client_idClient' }),
        __metadata("design:type", Client_1.Client)
    ], Reservation.prototype, "clientIdClient", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return TypeReservation_1.TypeReservation; }, function (TypeReservation) { return TypeReservation.reservations; }, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'TypeReservation_typeReservation' }),
        __metadata("design:type", TypeReservation_1.TypeReservation)
    ], Reservation.prototype, "typeReservationTypeReservation", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Payer_1.Payer; }, function (Payer) { return Payer.reservationIdReservation; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "payers", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Doit_1.Doit; }, function (Doit) { return Doit.reservationIdReservation; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "doits", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Rendre_1.Rendre; }, function (Rendre) { return Rendre.reservationIdReservation; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "rendres", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Emprunt_1.Emprunt; }, function (Emprunt) { return Emprunt.reservationIdReservation; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "emprunts", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Utiliser_1.Utiliser; }, function (Utiliser) { return Utiliser.reservationIdReservation; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "utilisers", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Constituer_1.Constituer; }, function (Constituer) { return Constituer.reservationIdReservation; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "constituers", void 0);
    __decorate([
        typeorm_1.ManyToMany(function () { return Salle_1.Salle; }, function (Salle) { return Salle.reservations; }, { nullable: false, }),
        typeorm_1.JoinTable({ name: 'Concerner' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "salles", void 0);
    __decorate([
        typeorm_1.ManyToMany(function () { return Materiels_1.Materiels; }, function (Materiels) { return Materiels.reservations; }, { nullable: false, }),
        typeorm_1.JoinTable({ name: 'Louer' }),
        __metadata("design:type", Array)
    ], Reservation.prototype, "materielss", void 0);
    Reservation = __decorate([
        typeorm_1.Entity("Reservation", { schema: "Berisheba" }),
        typeorm_1.Index("fk_Reservation_Client", ["clientIdClient",]),
        typeorm_1.Index("fk_Reservation_TypeReservation1", ["typeReservationTypeReservation",])
    ], Reservation);
    return Reservation;
}());
exports.Reservation = Reservation;
//# sourceMappingURL=Reservation.js.map