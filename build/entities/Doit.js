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
var Autre_1 = require("./Autre");
var Reservation_1 = require("./Reservation");
var Doit = /** @class */ (function () {
    function Doit() {
    }
    __decorate([
        typeorm_1.ManyToOne(function () { return Autre_1.Autre; }, function (Autre) { return Autre.doits; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Autre_typeAutre' }),
        __metadata("design:type", Autre_1.Autre)
    ], Doit.prototype, "autreTypeAutre", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.doits; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Reservation_idReservation' }),
        __metadata("design:type", Reservation_1.Reservation)
    ], Doit.prototype, "reservationIdReservation", void 0);
    __decorate([
        typeorm_1.Column("double precision", {
            nullable: true,
            name: "prixAutre"
        }),
        __metadata("design:type", Number)
    ], Doit.prototype, "prixAutre", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: false,
            primary: true,
            length: 100,
            name: "motif"
        }),
        __metadata("design:type", String)
    ], Doit.prototype, "motif", void 0);
    Doit = __decorate([
        typeorm_1.Entity("Doit"),
        typeorm_1.Index("fk_Autre_has_Reservation_Reservation1", ["reservationIdReservation",])
    ], Doit);
    return Doit;
}());
exports.Doit = Doit;
//# sourceMappingURL=Doit.js.map