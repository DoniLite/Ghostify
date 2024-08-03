import { prismaClient } from "./config/db";

export const deploymentTester = async () => {
  const data = await prismaClient.post.create({
    data:{
        title: 'Test post',
        date: new Date().toLocaleDateString(),
        slug: 'post-slug'
    }
  });
  if(data){
    console.log(data)
    return;
  }
  console.error('Error in creating post');
};


deploymentTester().then().catch(err => console.error(err));