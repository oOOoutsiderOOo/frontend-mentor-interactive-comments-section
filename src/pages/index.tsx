import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Comments from "../components/Comment";
import AddComment from "../components/AddComment";
import axios from "axios";

export type User = { image: { png: string; webp: string }; username: string };

export type Comment = {
    content: string;
    createdAt: string;
    id: string;
    replies: [Comment?];
    replyingTo?: string;
    score: number;
    user: User;
};

export type CommentsArray = Array<Comment>;

const Home: NextPage = () => {
    const [comments, setComments] = useState<CommentsArray | []>([]);
    const [user, setUser] = useState<User | {}>({});
    const [newComment, setNewComment] = useState<string>("");
    const [replyingTo, setReplyingTo] = useState<string>("");

    useEffect(() => {
        async function getComments() {
            const comments = await JSON.parse(localStorage.getItem("comments") as string);
            if (!comments) {
                try {
                    const response = await axios.get("/api/comments");
                    localStorage.setItem("comments", JSON.stringify(response.data));

                    setComments(response.data);
                } catch (error) {
                    console.error(error);
                }
            } else setComments(await JSON.parse(localStorage.getItem("comments") as string));
        }
        getComments();
    }, [newComment]);

    useEffect(() => {
        async function getUser() {
            const currentUser = await JSON.parse(localStorage.getItem("currentUser") as string);
            if (!currentUser) {
                try {
                    const response = await axios.get(`/api/users/1`);
                    localStorage.setItem("currentUser", JSON.stringify(response.data));
                    setUser(response.data);
                } catch (error) {
                    console.error(error);
                }
            } else {
                setUser(await JSON.parse(localStorage.getItem("currentUser") as string));
            }
        }
        getUser();
    }, []);

    return (
        <>
            <div className="app-wrapper">
                <Comments
                    comments={comments}
                    setComments={setComments}
                    setReplyingTo={setReplyingTo}
                    user={user as User}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    replyingTo={replyingTo}
                />
                <AddComment
                    user={user as User}
                    comments={comments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                />
            </div>
        </>
    );
};

export default Home;
