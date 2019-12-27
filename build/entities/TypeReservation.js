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
var TypeReservation = /** @class */ (function () {
    function TypeReservation() {
    }
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: false,
            primary: true,
            length: 20,
            name: "typeReservation"
        }),
        __metadata("design:type", String)
    ], TypeReservation.prototype, "typeReservation", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.typeReservationTypeReservation; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], TypeReservation.prototype, "reservations", void 0);
    TypeReservation = __decorate([
        typeorm_1.Entity("TypeReservation")
    ], TypeReservation);
    return TypeReservation;
}());
exports.TypeReservation = TypeReservation;
//# sourceMappingURL=TypeReservation.js.map