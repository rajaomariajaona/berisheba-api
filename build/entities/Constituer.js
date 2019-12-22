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
var DemiJournee_1 = require("./DemiJournee");
var Constituer = /** @class */ (function () {
    function Constituer() {
    }
    __decorate([
        typeorm_1.ManyToOne(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.constituers; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Reservation_idReservation' }),
        __metadata("design:type", Reservation_1.Reservation)
    ], Constituer.prototype, "reservationIdReservation", void 0);
    __decorate([
        typeorm_1.Column("int", {
            nullable: true,
            name: "nbPersonne"
        }),
        __metadata("design:type", Number)
    ], Constituer.prototype, "nbPersonne", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return DemiJournee_1.DemiJournee; }, function (DemiJournee) { return DemiJournee.constituers; }, { primary: true, nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
        typeorm_1.JoinColumn({ name: 'DemiJournee_date', referencedColumnName: "date" }),
        __metadata("design:type", Function)
    ], Constituer.prototype, "demiJourneeDate", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return DemiJournee_1.DemiJournee; }, function (DemiJournee) { return DemiJournee.constituers2; }, { primary: true, nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
        typeorm_1.JoinColumn({ name: 'DemiJournee_TypeDemiJournee', referencedColumnName: "TypeDemiJournee" }),
        __metadata("design:type", String)
    ], Constituer.prototype, "demiJourneeTypeDemiJournee", void 0);
    Constituer = __decorate([
        typeorm_1.Entity("Constituer", { schema: "Berisheba" }),
        typeorm_1.Index("fk_Constituer_DemiJournee1", ["demiJourneeDate", "demiJourneeTypeDemiJournee",])
    ], Constituer);
    return Constituer;
}());
exports.Constituer = Constituer;
//# sourceMappingURL=Constituer.js.map