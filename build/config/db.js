"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const redis_1 = require("redis");
exports.client = (0, redis_1.createClient)({
    password: "vQjlP3BWaQGwgrHzqZ3lBHnK67Ys4Uct",
    socket: {
        host: "redis-16063.c299.asia-northeast1-1.gce.redns.redis-cloud.com",
        port: 16063,
    },
});
exports.client.connect()
    .then(data => {
    console.log(data);
})
    .catch(err => {
    console.log(err);
});
//# sourceMappingURL=db.js.map