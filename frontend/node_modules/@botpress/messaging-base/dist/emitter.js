"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
class Emitter {
    constructor() {
        this.listeners = {};
    }
    on(event, listener, pushBack = false) {
        const listeners = this.listeners[event];
        if (!listeners) {
            this.listeners[event] = [listener];
        }
        else if (!pushBack) {
            listeners.push(listener);
        }
        else {
            listeners.unshift(listener);
        }
    }
    emit(event, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const listeners = this.listeners[event];
            if (listeners === null || listeners === void 0 ? void 0 : listeners.length) {
                for (const listener of listeners) {
                    yield listener(arg);
                }
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.Emitter = Emitter;
