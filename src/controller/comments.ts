import { Request, Response } from "express";
import { BodyXData } from "index";


export const comment = async (req: Request, res: Response) => {
    const {comment} = req.body as BodyXData;
    console.log(comment, res)
}