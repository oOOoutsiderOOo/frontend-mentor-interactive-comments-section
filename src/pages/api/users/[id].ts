// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import data from "../../../server/db/db.json";

const getCurrentUser = async (req: NextApiRequest, res: NextApiResponse) => {
    /*     const { id } = req.query;
    const response = await axios.get(`http://localhost:5000/currentUser`);
    res.status(200).json(response.data); */
    res.status(200).send(data.currentUser);
};

export default getCurrentUser;
