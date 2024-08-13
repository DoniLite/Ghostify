import { FastifyReply, FastifyRequest } from "fastify";
import { BodyXData } from "index";
import { prismaClient } from "../config/db";


export const projectPost = async (req: FastifyRequest, res: FastifyReply) => {
    const {
      title,
      description,
      github,
      gitlab,
      bitbucket,
      link,
      license,
      collaboration,
      collaborationMessage,
    } = req.body as BodyXData;

    const project = await prismaClient.project.create({
        data: {
            title: title,
            description: description,
            github: github,
            gitLab: gitlab,
            bitbucket: bitbucket,
            license: license,
            link: link,
            participation: collaborationMessage,
            participationType: collaboration
        }
    })

    if(project) {
        console.log(project)
        return res.send(JSON.stringify({ success: true, project}));
    }

    return res.send(JSON.stringify({ success: false, project}));
}