"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const users_1 = __importDefault(require("./routes/users"));
const reports_1 = __importDefault(require("./routes/reports"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "200mb" }));
app.use((0, cors_1.default)({
    credentials: true,
    origin: [
        "http://localhost:3000",
        "https://pvplc-portal-client.vercel.app",
        "http://143.198.132.8:8080",
        "https://testingplatform.xyz",
        "https://www.testingplatform.xyz",
    ],
}));
app.use((0, morgan_1.default)("tiny"));
app.use((0, cookie_parser_1.default)());
app.use("/api/users", users_1.default);
app.use("/api/reports", reports_1.default);
const uri = `mongodb+srv://tim:${process.env.MONGO_PASSWORD}@cluster0.k1aaw.mongodb.net/portalpvplc?retryWrites=true&w=majority`;
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("DB Connetion Successfull");
    app.listen(PORT, () => {
        console.log("listening on port", PORT);
    });
})
    .catch((err) => {
    console.error(err);
    console.log("connected to db");
});
mongoose_1.default.set("runValidators", true);
const PORT = process.env.PORT || 3080;
