import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User, CommentsArray } from "../pages";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";

const DoReply = (props: {
    user: User;
    comments: CommentsArray;
    setComments: Dispatch<SetStateAction<CommentsArray | []>>;
    newComment: string;
    setNewComment: Dispatch<SetStateAction<string>>;
    replyingTo: string;
    setReplyingTo: Dispatch<SetStateAction<string>>;
    parentId?: string;
}) => {
    const [replyText, setReplyText] = useState("");

    const postReply = async () => {
        const comments = await JSON.parse(localStorage.getItem("comments") as string);
        let newComment = {
            id: nanoid(10),
            content: replyText === "" ? props.newComment : replyText,
            createdAt: "now",
            score: 0,
            user: props.user,
            replyingTo: "replying to @name",
        };
        console.log(props.parentId);
        if (props.parentId === "") {
            let index = props.comments.findIndex(comment => {
                return comment.id === props.replyingTo;
            });
            comments[index].replies.push(newComment);
            localStorage.setItem("comments", JSON.stringify(comments));
        } else {
            let index = props.comments.findIndex(comment => {
                return comment.id === props.parentId;
            });
            comments[index].replies.push(newComment);
            localStorage.setItem("comments", JSON.stringify(comments));
        }
        props.setComments(await JSON.parse(localStorage.getItem("comments") as string));
        props.setReplyingTo("");
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="add-comment-wrapper">
            <img src={props.user.image && props.user.image.png} alt="" />
            <textarea value={replyText} name="" id="" rows={4} placeholder={"Add a reply..."} onChange={e => setReplyText(e.target.value)}></textarea>
            <button className="send" onClick={() => postReply()}>
                <span>REPLY</span>
            </button>
        </motion.div>
    );
};

export default DoReply;
