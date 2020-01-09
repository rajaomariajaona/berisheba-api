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
var Constituer_1 = require("./Constituer");
var DemiJournee = /** @class */ (function () {
    function DemiJournee() {
    }
    __decorate([
        typeorm_1.Column("date", {
            primary: true,
            nullable: false,
            name: "date",
        }),
        __metadata("design:type", Function)
    ], DemiJournee.prototype, "date", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            primary: true,
            nullable: false,
            length: 20,
            name: "TypeDemiJournee"
        }),
        __metadata("design:type", String)
    ], DemiJournee.prototype, "TypeDemiJournee", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Constituer_1.Constituer; }, function (Constituer) {
            return Constituer;
        }, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
        __metadata("design:type", Array)
    ], DemiJournee.prototype, "constituers", void 0);
    DemiJournee = __decorate([
        typeorm_1.Entity("DemiJournee")
    ], DemiJournee);
    return DemiJournee;
}());
exports.DemiJournee = DemiJournee;
//# sourceMappingURL=DemiJournee.js.map