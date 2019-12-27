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
var Appareil_1 = require("./Appareil");
var Reservation_1 = require("./Reservation");
var Utiliser = /** @class */ (function () {
    function Utiliser() {
    }
    __decorate([
        typeorm_1.ManyToOne(function () { return Appareil_1.Appareil; }, function (Appareil) { return Appareil.utilisers; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Appareil_typeAppareil' }),
        __metadata("design:type", Appareil_1.Appareil)
    ], Utiliser.prototype, "appareilTypeAppareil", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.utilisers; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Reservation_idReservation' }),
        __metadata("design:type", Reservation_1.Reservation)
    ], Utiliser.prototype, "reservationIdReservation", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 100,
            name: "nomAppareil"
        }),
        __metadata("design:type", String)
    ], Utiliser.prototype, "nomAppareil", void 0);
    __decorate([
        typeorm_1.Column("double precision", {
            nullable: true,
            name: "puissance"
        }),
        __metadata("design:type", Number)
    ], Utiliser.prototype, "puissance", void 0);
    __decorate([
        typeorm_1.Column("int", {
            nullable: true,
            name: "duree"
        }),
        __metadata("design:type", Number)
    ], Utiliser.prototype, "duree", void 0);
    Utiliser = __decorate([
        typeorm_1.Entity("Utiliser"),
        typeorm_1.Index("fk_Appareil_has_Reservation_Reservation1", ["reservationIdReservation",])
    ], Utiliser);
    return Utiliser;
}());
exports.Utiliser = Utiliser;
//# sourceMappingURL=Utiliser.js.map