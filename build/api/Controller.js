"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Controller = /** @class */ (function () {
    function Controller() {
        this.mainRouter = express_1.Router();
    }
    Controller.prototype.addErrorHandler = function (router) {
        var _this = this;
        router.use(function (err, req, res, next) {
            console.log(err);
            _this.sendResponse(res, 500, { error: err });
        });
    };
    Controller.prototype.sendResponse = function (response, statusCode, data) {
        response.status(statusCode).json(data);
    };
    Controller.prototype.passErrorToExpress = function (err, next) {
        next(err);
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map