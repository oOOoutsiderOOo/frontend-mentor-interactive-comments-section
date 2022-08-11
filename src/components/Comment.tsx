import type { Comment, CommentsArray } from "../pages";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import DoReply from "./DoReply";
import { User } from "../pages";

const Comments = (props: {
    comments: CommentsArray;
    setComments: Dispatch<SetStateAction<CommentsArray | []>>;
    setReplyingTo: Dispatch<SetStateAction<string>>;
    user: User;
    newComment: string;
    setNewComment: Dispatch<SetStateAction<string>>;
    replyingTo: string;
    parentId?: string;
}) => {
    const deleteComment = (e: MouseEvent) => {
        const newComments = props.comments.filter(comment => comment.id !== (e.target as HTMLButtonElement).value);
        const newCommentsAndReplies = newComments.map(comment => {
            if (comment.replies.length !== 0) {
                let newReplies: Array<any> = comment.replies.filter(reply => reply?.id !== (e.target as HTMLButtonElement).value);
                comment.replies = newReplies as [(Comment | undefined)?];
            }
            return comment;
        });
        localStorage.setItem("comments", JSON.stringify(newCommentsAndReplies));
        props.setComments(newCommentsAndReplies);
    };

    const CommentTemplate = (commentObj: Comment, parentID: string = "") => {
        return (
            <div className="comment-wrapper" key={commentObj.id}>
                <div className="comment">
                    <div className="likes">
                        <div className="plus">
                            <img src="/images/icon-plus.svg" alt="" />
                        </div>
                        <div className="amount">{commentObj.score}</div>
                        <div className="minus">
                            <img src="/images/icon-minus.svg" alt="" />
                        </div>
                    </div>
                    <div className="name-row">
                        <img src={commentObj.user.image.png} alt="" />
                        <div className="name">{commentObj.user.username}</div>
                        <div className="time">{commentObj.createdAt}</div>
                    </div>
                    <div className="actions-row">
                        <button value={commentObj.id} className="reply" onClick={e => props.setReplyingTo((e.target as HTMLButtonElement).value)}>
                            Reply
                        </button>
                        <button className="edit">Edit</button>
                        <button value={commentObj.id} className="delete" onClick={e => deleteComment(e)}>
                            Delete
                        </button>
                    </div>
                    <div className="content">{commentObj.content}</div>
                </div>
                {props.replyingTo === commentObj.id && (
                    <DoReply
                        user={props.user as User}
                        comments={props.comments}
                        setComments={props.setComments}
                        newComment={props.newComment}
                        setNewComment={props.setNewComment}
                        replyingTo={props.replyingTo}
                        setReplyingTo={props.setReplyingTo}
                        parentId={parentID}
                    />
                )}
                {commentObj.replies?.length !== 0 && (
                    <div className="responses-wrapper">
                        {commentObj.replies?.map(reply => {
                            return CommentTemplate(reply as Comment, commentObj.id);
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {props.comments !== undefined &&
                props.comments.map(comment => {
                    return CommentTemplate(comment);
                })}
        </>
    );
};

export default Comments;
