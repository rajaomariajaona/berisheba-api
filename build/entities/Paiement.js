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
var Payer_1 = require("./Payer");
var Paiement = /** @class */ (function () {
    function Paiement() {
    }
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: false,
            primary: true,
            length: 20,
            name: "typePaiement"
        }),
        __metadata("design:type", String)
    ], Paiement.prototype, "typePaiement", void 0);
    __decorate([
        typeorm_1.OneToMany(function () { return Payer_1.Payer; }, function (Payer) { return Payer.paiementTypePaiement; }, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }),
        __metadata("design:type", Array)
    ], Paiement.prototype, "payers", void 0);
    Paiement = __decorate([
        typeorm_1.Entity("Paiement")
    ], Paiement);
    return Paiement;
}());
exports.Paiement = Paiement;
//# sourceMappingURL=Paiement.js.map