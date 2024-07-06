import { prismaClient } from "./config/db";

const test = async () => {
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


test().then().catch(err => console.error(err));