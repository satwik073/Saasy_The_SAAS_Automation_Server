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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_authenticated_user = void 0;
const jwt = require('jsonwebtoken');
const UserRegisteringModal_1 = __importDefault(require("../../Model/user_model/UserRegisteringModal"));
const is_authenticated_user = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = request.headers;
        if (authorization && authorization.startsWith("Bearer ")) {
            const fetching_token = authorization.split(" ")[1];
            if (!fetching_token)
                throw new Error("Token can't be fetched at this moment");
            const SECRET_KEY_FETCHED = process.env.JWT_SECRET_KEY_ATTACHED;
            if (!SECRET_KEY_FETCHED)
                throw new Error("JWT Secret key not defined");
            const decoding_token_data = jwt.verify(fetching_token, SECRET_KEY_FETCHED);
            const user = yield UserRegisteringModal_1.default.findById(decoding_token_data.id);
            if (!user) {
                return response.status(401).json({ Error: "User not found" });
            }
            request.user = user;
            next();
        }
        else {
            return response.status(401).json({ Error: "Authorization token not found, Login first to access Resources" });
        }
    }
    catch (error) {
        return response.status(500).json({ Error: 'Something went wrong, try again later', details: error.message });
    }
});
exports.is_authenticated_user = is_authenticated_user;