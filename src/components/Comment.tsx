import type { Comment, CommentsArray } from "../pages";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import axios from "axios";

const Comments = (props: { comments: CommentsArray; setComments: Dispatch<SetStateAction<CommentsArray | []>> }) => {
    const deleteComment = (e: MouseEvent) => {
        axios.delete(`http://localhost:5000/comments/${(e.target as HTMLButtonElement).value}`).then(() => console.log("hecho"));
    };

    const CommentTemplate = (commentObj: Comment) => {
        return (
            <div className="comment-wrapper" key={commentObj.id}>
                <div className="likes">
                    <div className="plus"></div>
                    <div className="amount">{commentObj.score}</div>
                    <div className="minus"></div>
                </div>
                <div className="name-row">
                    <img src={commentObj.user.image.png} alt="" />
                    <div className="name">{commentObj.user.username}</div>
                    <div className="time">{commentObj.createdAt}</div>
                </div>
                <button className="reply">Reply</button>
                <button className="edit">Edit</button>
                <button value={commentObj.id} className="delete" onClick={e => deleteComment(e)}>
                    Delete
                </button>
                <div className="content">{commentObj.content}</div>
                {commentObj.replies?.length !== 0 && (
                    <div className="responses-wrapper">
                        {commentObj.replies?.map(reply => {
                            return CommentTemplate(reply as Comment);
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {props.comments !== undefined &&
                props.comments.map(comment => {
                    return CommentTemplate(comment);
                })}
        </div>
    );
};

export default Comments;
