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
var Ustensile_1 = require("./Ustensile");
var Reservation_1 = require("./Reservation");
var Emprunt = /** @class */ (function () {
    function Emprunt() {
    }
    __decorate([
        typeorm_1.ManyToOne(function () { return Ustensile_1.Ustensile; }, function (Ustensile) { return Ustensile.emprunts; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Ustensile_idUstensile' }),
        __metadata("design:type", Ustensile_1.Ustensile)
    ], Emprunt.prototype, "ustensileIdUstensile", void 0);
    __decorate([
        typeorm_1.ManyToOne(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.emprunts; }, { primary: true, nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'Reservation_idReservation' }),
        __metadata("design:type", Reservation_1.Reservation)
    ], Emprunt.prototype, "reservationIdReservation", void 0);
    __decorate([
        typeorm_1.Column("date", {
            nullable: true,
            name: "dateEmprunt"
        }),
        __metadata("design:type", String)
    ], Emprunt.prototype, "dateEmprunt", void 0);
    __decorate([
        typeorm_1.Column("int", {
            nullable: true,
            name: "nbEmprunt"
        }),
        __metadata("design:type", Number)
    ], Emprunt.prototype, "nbEmprunt", void 0);
    Emprunt = __decorate([
        typeorm_1.Entity("Emprunt", { schema: "Berisheba" }),
        typeorm_1.Index("fk_Ustensile_has_Reservation_Reservation1", ["reservationIdReservation",])
    ], Emprunt);
    return Emprunt;
}());
exports.Emprunt = Emprunt;
//# sourceMappingURL=Emprunt.js.map