import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Comments from "../components/Comment";
import AddComment from "../components/AddComment";
import axios from "axios";

export type User = { image: { png: string; webp: string }; username: string };

export type Comment = {
    content: string;
    createdAt: string;
    id: number;
    replies: [Comment?];
    score: number;
    user: User;
};

export type CommentsArray = Array<Comment>;

const Home: NextPage = () => {
    const [comments, setComments] = useState<CommentsArray | []>([]);
    const [user, setUser] = useState<User | {}>({});

    useEffect(() => {
        async function getComments() {
            try {
                const response = await axios.get("http://localhost:5000/comments");
                setComments(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getComments();
    }, []);

    useEffect(() => {
        async function getUser() {
            try {
                const response = await axios.get("http://localhost:5000/currentUser");
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getUser();
    }, []);

    return (
        <>
            <Comments comments={comments} setComments={setComments} />
            <AddComment user={user} comments={comments} />
        </>
    );
};

export default Home;
