"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthEventType = void 0;
var HealthEventType;
(function (HealthEventType) {
    HealthEventType["Create"] = "create";
    HealthEventType["Configure"] = "configure";
    HealthEventType["Start"] = "start";
    HealthEventType["StartFailure"] = "start-failure";
    HealthEventType["Initialize"] = "initialize";
    HealthEventType["InitializeFailure"] = "initialize-failure";
    HealthEventType["Sleep"] = "sleep";
    HealthEventType["Delete"] = "delete";
})(HealthEventType = exports.HealthEventType || (exports.HealthEventType = {}));
