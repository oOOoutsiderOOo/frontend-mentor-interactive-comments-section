import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { User, CommentsArray } from "../pages";
import { nanoid } from "nanoid";

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
            replies: [],
            score: 0,
            user: props.user,
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
        <div className="add-comment-wrapper">
            <img src={props.user.image && props.user.image.png} alt="" />
            <textarea
                value={replyText}
                name=""
                id=""
                cols={30}
                rows={4}
                placeholder={"Add a reply..."}
                onChange={e => setReplyText(e.target.value)}></textarea>
            <button onClick={() => postReply()}>SEND</button>
        </div>
    );
};

export default DoReply;
