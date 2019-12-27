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
var Materiels = /** @class */ (function () {
    function Materiels() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            type: "int",
            name: "idMateriels"
        }),
        __metadata("design:type", Number)
    ], Materiels.prototype, "idMateriels", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 50,
            name: "nomMateriels"
        }),
        __metadata("design:type", String)
    ], Materiels.prototype, "nomMateriels", void 0);
    __decorate([
        typeorm_1.Column("int", {
            nullable: true,
            name: "nbStock"
        }),
        __metadata("design:type", Number)
    ], Materiels.prototype, "nbStock", void 0);
    __decorate([
        typeorm_1.ManyToMany(function () { return Reservation_1.Reservation; }, function (Reservation) { return Reservation.materielss; }),
        __metadata("design:type", Array)
    ], Materiels.prototype, "reservations", void 0);
    Materiels = __decorate([
        typeorm_1.Entity("Materiels")
    ], Materiels);
    return Materiels;
}());
exports.Materiels = Materiels;
//# sourceMappingURL=Materiels.js.map