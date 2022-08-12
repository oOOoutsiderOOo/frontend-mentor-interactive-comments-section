import React, { Dispatch, SetStateAction } from "react";
import { Comment, CommentsArray } from "../pages";
import { motion, AnimatePresence } from "framer-motion";

const Likes = (props: {
    comment: Comment;
    comments: CommentsArray;
    setComments: Dispatch<SetStateAction<CommentsArray | []>>;
    parentId?: string;
    index: number;
}) => {
    const handleLikes = async (value: string) => {
        const comments = await JSON.parse(localStorage.getItem("comments") as string);
        let newScore = value === "+" ? props.comment.score + 1 : props.comment.score - 1;
        let newComment = {
            ...props.comment,
            score: newScore,
        };

        if (props.parentId === "") {
            comments.splice(props.index, 1, newComment);
            localStorage.setItem("comments", JSON.stringify(comments));
        } else {
            let index = props.comments.findIndex((comment: Comment) => {
                return comment.id === props.parentId;
            });
            comments[index].replies.splice(props.index, 1, newComment);
            localStorage.setItem("comments", JSON.stringify(comments));
        }
        props.setComments(await JSON.parse(localStorage.getItem("comments") as string));
    };

    return (
        <div className="likes">
            <div className="plus" id="+" onClick={e => handleLikes(e.target.id)}>
                <img src="/images/icon-plus.svg" id="+" alt="" onClick={e => handleLikes(e.target.id)} />
            </div>
            <div className="amount">{props.comment.score}</div>
            <div className="minus" id="-" onClick={e => handleLikes(e.target.id)}>
                <img src="/images/icon-minus.svg" id="-" alt="" onClick={e => handleLikes(e.target.id)} />
            </div>
        </div>
    );
};

export default Likes;
