import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User, CommentsArray } from "../pages";
import { nanoid } from "nanoid";

const AddComment = (props: {
    user: User;
    comments: CommentsArray;
    newComment: string;
    setNewComment: Dispatch<SetStateAction<string>>;
    replyingTo: string;
    setReplyingTo: Dispatch<SetStateAction<string>>;
    parentId?: string;
}) => {
    const postComment = async () => {
        const comments = await JSON.parse(localStorage.getItem("comments") as string);
        let newComment = {
            id: nanoid(10),
            content: props.newComment,
            createdAt: "now",
            replies: [],
            score: 0,
            user: props.user,
        };
        comments.push(newComment);
        localStorage.setItem("comments", JSON.stringify(comments));
        props.setNewComment("");
    };

    return (
        <div className="add-comment-wrapper">
            <img src={props.user.image && props.user.image.png} alt="" />
            <textarea
                value={props.newComment}
                name=""
                id=""
                cols={30}
                rows={4}
                placeholder={"Add a comment..."}
                onChange={e => props.setNewComment(e.target.value)}></textarea>
            <button onClick={() => postComment()}>SEND</button>
        </div>
    );
};

export default AddComment;
