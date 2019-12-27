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
var Salle = /** @class */ (function () {
    function Salle() {
    }
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: false,
            primary: true,
            length: 10,
            name: "idSalle"
        }),
        __metadata("design:type", String)
    ], Salle.prototype, "idSalle", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 100,
            name: "nomSalle"
        }),
        __metadata("design:type", String)
    ], Salle.prototype, "nomSalle", void 0);
    __decorate([
        typeorm_1.ManyToMany(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.salles; }),
        __metadata("design:type", Array)
    ], Salle.prototype, "reservations", void 0);
    Salle = __decorate([
        typeorm_1.Entity("Salle")
    ], Salle);
    return Salle;
}());
exports.Salle = Salle;
//# sourceMappingURL=Salle.js.map