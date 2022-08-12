import React, { Dispatch, SetStateAction, useState } from "react";
import { Comment, CommentsArray, User } from "../pages";
import { motion, AnimatePresence } from "framer-motion";

const Likes = (props: {
    user: User;
    comment: Comment;
    comments: CommentsArray;
    setComments: Dispatch<SetStateAction<CommentsArray | []>>;
    parentId?: string;
    index: number;
}) => {
    const [voted, setVoted] = useState<"+" | "" | "-">(props.comment.vote);

    const handleLikes = async (value: string) => {
        try {
            const comments: CommentsArray = await JSON.parse(localStorage.getItem("comments") as string);
            if (props.comment.vote === value) {
                throw "Already voted";
            }
            let newComment = { ...props.comment };
            if (value === "+") {
                newComment = {
                    ...props.comment,
                    score: props.comment.score + 1,
                    vote: props.comment.vote === "-" ? "" : "+",
                };
                setVoted(props.comment.vote === "-" ? "" : "+");
            }

            if (value === "-") {
                newComment = {
                    ...props.comment,
                    score: props.comment.score - 1,
                    vote: props.comment.vote === "+" ? "" : "-",
                };
                setVoted(props.comment.vote === "+" ? "" : "-");
            }

            console.log("voted " + voted);

            if (props.parentId === "") {
                comments.splice(props.index, 1, newComment);
                localStorage.setItem("comments", JSON.stringify(comments));
            } else {
                let index = props.comments.findIndex((comment: Comment) => {
                    return comment.id === props.parentId;
                });
                comments[index]?.replies.splice(props.index, 1, newComment);
                localStorage.setItem("comments", JSON.stringify(comments));
            }
            props.setComments(await JSON.parse(localStorage.getItem("comments") as string));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="likes">
            <div className={voted === "+" ? "plus already-voted" : "plus"} id="+" onClick={e => handleLikes((e.target as HTMLElement).id)}>
                <img src="/images/icon-plus.svg" id="+" alt="" onClick={e => handleLikes((e.target as HTMLElement).id)} />
            </div>
            <div className="amount">{props.comment.score}</div>
            <div className={voted === "-" ? "minus already-voted" : "minus"} id="-" onClick={e => handleLikes((e.target as HTMLElement).id)}>
                <img src="/images/icon-minus.svg" id="-" alt="" onClick={e => handleLikes((e.target as HTMLElement).id)} />
            </div>
        </div>
    );
};

export default Likes;
