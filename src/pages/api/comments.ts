// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import data from "../../server/db/db.json";

const comments = async (req: NextApiRequest, res: NextApiResponse) => {
    /*     const response = await axios.get("http://localhost:5000/comments");
    res.status(200).json(response.data);
    console.log(response.data); */
    res.status(200).send(data.comments);
};

export default comments;
