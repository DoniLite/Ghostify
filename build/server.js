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
const fastify_1 = __importDefault(require("fastify"));
const view_1 = __importDefault(require("@fastify/view"));
const ejs_1 = __importDefault(require("ejs"));
const static_1 = __importDefault(require("@fastify/static"));
const formbody_1 = __importDefault(require("@fastify/formbody"));
const session_1 = __importDefault(require("@fastify/session"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const node_path_1 = __importDefault(require("node:path"));
const db_1 = require("./config/db");
const server = (0, fastify_1.default)();
server.register(view_1.default, {
    engine: {
        ejs: ejs_1.default,
    },
});
server.register(static_1.default, {
    root: node_path_1.default.join(node_path_1.default.resolve(__dirname, ".."), "src/public"),
    prefix: "/static/",
});
server.register(formbody_1.default);
server.register(cookie_1.default);
server.register(session_1.default, {
    secret: "This is the Server of @DoniLiteGhost",
});
server.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.view("/src/views/loader.ejs", { pagination: 0, activeIndex: 0 });
}));
server.post("/home", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function fetchRandomQuote() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("https://api.quotable.io/random");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = yield response.json();
            console.log(`"${data.content}" —${data.author}`);
            return data;
        });
    }
    const quote = yield fetchRandomQuote();
    db_1.client.hSet("Quote", {
        _id: quote._id,
        content: quote.content,
        author: quote.author,
        authorSlug: quote.authorSlug,
    });
    function extractEssentialWeatherData(data) {
        const { datetime, tempmax, tempmin, conditions, description, icon } = data;
        return { datetime, tempmax, tempmin, conditions, description, icon };
    }
    const bodyData = req.body;
    const { data } = bodyData;
    const userTown = data.country_capital;
    const flag = data.country_flag;
    console.log(data);
    const WeatherResponse = yield fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userTown}?unitGroup=metric&key=FLJ2SXSD4HVS6KL7Z6KFGCH8Y&contentType=json`);
    const weatherData = yield WeatherResponse.json();
    const weather = weatherData.days[0];
    console.log(weatherData);
    db_1.client.hSet("Weather", Object.assign(Object.assign({}, extractEssentialWeatherData(weather)), { flag: flag }));
    return res.send(JSON.stringify({ url: "/home" }));
}));
server.get("/home", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = yield db_1.client.hGetAll("Weather");
    const quote = yield db_1.client.hGetAll("Quote");
    console.log(value);
    return res.view("/src/views/index.ejs", { pagination: 1, activeIndex: 0, weatherData: value, quote: quote });
}));
server.get('/blog', (req, res) => {
    return res.view("/src/views/blogOne.ejs", { pagination: 1, activeIndex: 3 });
});
const port = Number(process.env.PORT) || 3081;
server.listen({ port: port }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
    console.log(__dirname);
});
//# sourceMappingURL=server.js.map