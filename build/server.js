"use strict";
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
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("@fastify/cors"));
const home_1 = require("./routes/home");
const home_2 = require("./contoler/home");
const server = (0, fastify_1.default)();
const opts = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    pong: {
                        type: "string",
                    },
                },
            },
        },
    },
};
server.register(cors_1.default, {
    // put your options here
    origin: "*",
    credentials: true,
    cacheControl: "Cache-Control: ${fully}",
});
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
server.get("/", routes_1.index);
server.post("/home", home_2.homeControler);
server.get("/home", home_1.home);
server.get("/api/", routes_1.index);
server.get('/blog', (req, res) => {
    return res.view("/src/views/blogOne.ejs", { pagination: 1, activeIndex: 3 });
});
const port = parseInt(process.env.PORT) || 3081;
server.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=server.js.map