import { Dispatch, MouseEvent, SetStateAction } from "react";
import type { Comment, CommentsArray } from "../pages";
import { motion } from "framer-motion";
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="comment">
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
                        {commentObj.user.username === props.user.username && <div className="you">you</div>}
                        <div className="time">{commentObj.createdAt}</div>
                    </div>
                    <div className="actions-row">
                        {commentObj.user.username !== props.user.username && (
                            <button
                                value={commentObj.id}
                                id={commentObj.id}
                                className="reply"
                                onClick={e => props.setReplyingTo((e.target as HTMLButtonElement).value)}>
                                <img src="/images/icon-reply.svg" alt="" />
                                Reply
                            </button>
                        )}
                        {commentObj.user.username === props.user.username && (
                            <button value={commentObj.id} className="delete" onClick={e => deleteComment(e)}>
                                <img src="/images/icon-delete.svg" alt="" />
                                Delete
                            </button>
                        )}
                        {commentObj.user.username === props.user.username && (
                            <button className="edit">
                                <img src="/images/icon-edit.svg" alt="" />
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="content">{commentObj.content}</div>
                </motion.div>
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
                        {!commentObj.replyingTo && (
                            <div className="responses-line-container">
                                <div className="responses-line"></div>
                            </div>
                        )}
                        <div className="responses">
                            {commentObj.replies?.map(reply => {
                                return CommentTemplate(reply as Comment, commentObj.id);
                            })}
                        </div>
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
