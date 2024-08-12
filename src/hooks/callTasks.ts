import v8 from "node:v8";
import { ee } from "../server";
import { prismaClient } from "../config/db";

export const PosterTask = async () => {
  let resFunc;
  let utilsDate;
  // let dom: HTMLAllCollection;
  // dom.length

  const date = new Date();
  const H = date.getHours();
  if ((H > 6 && H < 15) || (H > 22 && H < 6)) {
    ee.emit("evrymorningAndNyTask", "It's time to do the task");
    ee.emit("evrymorningAndNyTask", `Task begening... Collecting posts `);
    // const regex = new RegExp('\\');
    const taskRunner = await makeSomeThing();
    if (!taskRunner) {
      utilsDate = 60 * 60 * 6 * 1000;
      console.log(utilsDate);
      ee.emit(
        "evrymorningAndNyTask",
        "Error during running the task it will be schedule for later execution"
      );
      return resFunc = setTimeout(async () => {
        await PosterTask();
      }, utilsDate);
    }
    utilsDate = 60 * 60 * 6 * 1000;
    ee.emit("evrymorningAndNyTask", `last execution time: ${date.getHours()}`);
    date.setHours(date.getHours() + 6);
    ee.emit(
      "evrymorningAndNyTask",
      `last execution time: ${date.getHours()}`
    );
    return (resFunc = setTimeout(async () => {
      await PosterTask();
    }, utilsDate));
  }
  ee.emit("evrymorningAndNyTask", "It's look like time it not properly scheduling for later execution");
  ee.emit("evrymorningAndNyTask", `last verification time: ${date.getHours()}`);
  date.setHours(date.getHours() + 6);
  ee.emit("evrymorningAndNyTask", `next verification time: ${date.getHours()}`);
  utilsDate = 60 * 60 * 6 * 1000;
  return resFunc = setTimeout(async () => {
    await PosterTask();
  }, utilsDate);
};


export const ActuTask = async() => {
  let resFunc;
  let utilsDate;

  const date = new Date();
  
}

async function makeSomeThing() {
  const posts = await prismaClient.post.findMany();
  if (!posts) return false;
  console.log(posts);
  return true;
}