import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User, CommentsArray, Comment } from "../pages";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";

const Edit = (props: {
    user: User;
    comments: CommentsArray;
    setComments: Dispatch<SetStateAction<CommentsArray | []>>;
    parentId?: string;
    commentToEdit: Comment;
    index: number;
    setEditingId: Dispatch<SetStateAction<string>>;
}) => {
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        setReplyText(props.commentToEdit.content);
    }, []);

    const postReply = async () => {
        const comments = await JSON.parse(localStorage.getItem("comments") as string);
        let newComment = {
            ...props.commentToEdit,
            content: replyText,
        };

        if (props.parentId === "") {
            comments.splice(props.index, 1, newComment);
            localStorage.setItem("comments", JSON.stringify(comments));
        } else {
            let index = props.comments.findIndex(comment => {
                return comment.id === props.parentId;
            });
            console.log("padre" + index + "hijo" + props.index);
            console.log(comments[index].replies.splice(props.index, 1, newComment));
            localStorage.setItem("comments", JSON.stringify(comments));
        }
        props.setComments(await JSON.parse(localStorage.getItem("comments") as string));
        props.setEditingId("");
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="add-comment-wrapper">
            <img src={props.user.image && props.user.image.png} alt="" />
            <textarea
                value={replyText}
                name=""
                id=""
                rows={4}
                placeholder={"Add a reply..."}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => {
                    e.key === "Enter" && postReply();
                }}></textarea>
            <button className="send" onClick={() => postReply()}>
                <span>UPDATE</span>
            </button>
        </motion.div>
    );
};

export default Edit;
