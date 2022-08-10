import axios from "axios";
import { userAgent } from "next/server";
import { User, CommentsArray } from "../pages";

const AddComment = (props: { user: User; comments: CommentsArray }) => {
    const postComment = () => {
        axios.post("http://localhost:5000/comments", {
            content: "aowidaiwd",
            createdAt: "now",
            replies: [],
            score: 0,
            user: props.user,
        });
    };

    return (
        <div className="add-comment-wrapper">
            <img src={props.user.image && props.user.image.png} alt="" />
            <textarea name="" id="" cols={30} rows={4}></textarea>
            <button onClick={() => postComment()}>SEND</button>
        </div>
    );
};

export default AddComment;
