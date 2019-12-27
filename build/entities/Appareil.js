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
var Utiliser_1 = require("./Utiliser");
var Appareil = /** @class */ (function () {
    function Appareil() {
    }
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: false,
            primary: true,
            length: 50,
            name: "typeAppareil"
        }),
        __metadata("design:type", String)
    ], Appareil.prototype, "typeAppareil", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Utiliser_1.Utiliser; }, function (Utiliser) { return Utiliser.appareilTypeAppareil; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Appareil.prototype, "utilisers", void 0);
    Appareil = __decorate([
        typeorm_1.Entity("Appareil")
    ], Appareil);
    return Appareil;
}());
exports.Appareil = Appareil;
//# sourceMappingURL=Appareil.js.map