// import { StatsData } from "index";
// import { prismaClient } from "./config/db";
// import { createDirIfNotExists, DATA_PATH } from "./utils";
// import fs from 'node:fs'
// import path from "node:path";

export const deploymentTester = async () => {
  // const data = await prismaClient.post.create({
  //   data:{
  //       title: 'Test post',
  //       date: new Date().toLocaleDateString(),
  //       slug: 'post-slug'
  //   }
  // });
  // if(data){
  //   console.log(data)
  //   return;
  // }
  // console.error('Error in creating post');
  // const stats: StatsData = {
  //   total_visitor: 0,
  //   urls: [],
  //   weekly: {
  //     index: 0,
  //     visitor: 0,
  //   },
  //   monthly: {
  //     month: "Janvier",
  //     visitor: 0,
  //   },
  //   1: {
  //     visitor: 0,
  //     url: "http:/home/",
  //   }
  // };
  // console.log(stats["1"]);
  // createDirIfNotExists(DATA_PATH)
  // fs.writeFile(path.join(DATA_PATH, 'statistics.json'), JSON.stringify(stats, null, 4), 'utf8', (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
  // const jsString = fs.readFileSync(
  //   path.join(DATA_PATH, "statistics.json"),
  //   "utf8"
  // );
  // const json = JSON.parse(jsString)
  // console.log(json)
};

// deploymentTester().then().catch(err => console.error(err));