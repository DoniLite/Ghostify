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
exports.homeControler = void 0;
const db_1 = require("../config/db");
const homeControler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.homeControler = homeControler;
//# sourceMappingURL=home.js.map