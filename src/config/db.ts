import { createClient } from "redis";

export const client = createClient({
  password: "vQjlP3BWaQGwgrHzqZ3lBHnK67Ys4Uct",
  socket: {
    host: "redis-16063.c299.asia-northeast1-1.gce.redns.redis-cloud.com",
    port: 16063,
  },
});

client.connect()
.then(data=> {
    console.log(data);
})
.catch(err => {
    console.log(err);
});
