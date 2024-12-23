"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("./routes/product"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// middleware to parse incoming request in JSON format
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/products", product_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist/frontend/browser")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../frontend/dist/frontend/browser/index.html"));
});
exports.default = app;
