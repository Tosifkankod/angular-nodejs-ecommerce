"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./utils/data-source");
data_source_1.AppDataSource.initialize().then(() => {
    app_1.default.listen(4000, () => {
        console.log("server started & database connected");
    });
}).catch((err) => {
    console.log(err);
});
