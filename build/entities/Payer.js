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
var Paiement_1 = require("./Paiement");
var Payer = /** @class */ (function () {
    function Payer() {
    }
    __decorate([
        typeorm_1.ManyToOne(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.payers; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Reservation_idReservation' }),
        __metadata("design:type", Reservation_1.Reservation)
    ], Payer.prototype, "reservationIdReservation", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Paiement_1.Paiement; }, function (Paiement) { return Paiement.payers; }, { primary: true, nullable: false, onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
        typeorm_1.JoinColumn({ name: 'Paiement_typePaiement' }),
        __metadata("design:type", Paiement_1.Paiement)
    ], Payer.prototype, "paiementTypePaiement", void 0);
    __decorate([
        typeorm_1.Column("double precision", {
            nullable: false,
            name: "sommePayee"
        }),
        __metadata("design:type", Number)
    ], Payer.prototype, "sommePayee", void 0);
    Payer = __decorate([
        typeorm_1.Entity("Payer"),
        typeorm_1.Index("fk_Reservation_has_Paiement_Paiement1", ["paiementTypePaiement",])
    ], Payer);
    return Payer;
}());
exports.Payer = Payer;
//# sourceMappingURL=Payer.js.map