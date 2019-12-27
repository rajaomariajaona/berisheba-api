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
var Rendre_1 = require("./Rendre");
var Emprunt_1 = require("./Emprunt");
var Ustensile = /** @class */ (function () {
    function Ustensile() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn({
            type: "int",
            name: "idUstensile"
        }),
        __metadata("design:type", Number)
    ], Ustensile.prototype, "idUstensile", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 100,
            name: "nomUstensile"
        }),
        __metadata("design:type", String)
    ], Ustensile.prototype, "nomUstensile", void 0);
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 45,
            name: "nbDisponible"
        }),
        __metadata("design:type", String)
    ], Ustensile.prototype, "nbDisponible", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Rendre_1.Rendre; }, function (Rendre) { return Rendre.ustensileIdUstensile; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Ustensile.prototype, "rendres", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Emprunt_1.Emprunt; }, function (Emprunt) { return Emprunt.ustensileIdUstensile; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Ustensile.prototype, "emprunts", void 0);
    Ustensile = __decorate([
        typeorm_1.Entity("Ustensile")
    ], Ustensile);
    return Ustensile;
}());
exports.Ustensile = Ustensile;
//# sourceMappingURL=Ustensile.js.map