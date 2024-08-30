// import { StatsData } from "index";
// import { prismaClient } from "./config/db";
// import { createDirIfNotExists, DATA_PATH } from "./utils";
import fs from 'node:fs';
import path from 'node:path';
import { reduceStringSuite, unify } from './utils';

export const deploymentTester = async () => {
  const articlesPath = path.resolve(__dirname, '../src/articles');
  const filePath = path.join(articlesPath, 'Bibliothéques.md');
  const content = fs.readFileSync(filePath, 'utf8');
  const result = await unify(content);
  console.log(result);

  const testStr = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, debitis magnam voluptates, aperiam esse dolores sit totam enim odio ducimus consequuntur molestias. Ab exercitationem quidem repudiandae ullam amet numquam corporis veniam dignissimos saepe reiciendis qui recusandae cum quaerat rem beatae deserunt, dolorum sequi asperiores, harum labore eaque. Reprehenderit, nam sed.`;
  const r2 = reduceStringSuite(testStr);
  console.log(r2);
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

deploymentTester()
  .then()
  .catch((err) => console.error(err));
