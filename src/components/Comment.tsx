import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import type { Comment, CommentsArray } from "../pages";
import { motion } from "framer-motion";
import DoReply from "./DoReply";
import { User } from "../pages";
import Edit from "./Edit";
import Likes from "./Likes";

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
    const [editingId, setEditingId] = useState("");
    const [deletingId, setDeletingId] = useState("");

    const deleteComment = (id: string) => {
        const newComments = props.comments.filter(comment => comment.id !== id);
        const newCommentsAndReplies = newComments.map(comment => {
            if (comment.replies.length !== 0) {
                let newReplies: Array<any> = comment.replies.filter(reply => reply?.id !== id);
                comment.replies = newReplies as [(Comment | undefined)?];
            }
            return comment;
        });
        localStorage.setItem("comments", JSON.stringify(newCommentsAndReplies));
        props.setComments(newCommentsAndReplies);
        setDeletingId("");
    };

    const handleReplyButton = (value: string) => {
        value == props.replyingTo ? props.setReplyingTo("") : props.setReplyingTo(value);
        setEditingId("");
    };

    const CommentTemplate = (commentObj: Comment, index: number, parentID: string = "") => {
        return (
            <div className="comment-wrapper" key={commentObj.id}>
                {editingId !== commentObj.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="comment">
                        <Likes comment={commentObj} comments={props.comments} setComments={props.setComments} parentId={parentID} index={index} />
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
                                    onClick={e => handleReplyButton((e.target as HTMLButtonElement).value)}>
                                    <img src="/images/icon-reply.svg" alt="" />
                                    Reply
                                </button>
                            )}
                            {commentObj.user.username === props.user.username && (
                                <button value={commentObj.id} className="delete" onClick={e => setDeletingId((e.target as HTMLButtonElement).value)}>
                                    <img src="/images/icon-delete.svg" alt="" />
                                    Delete
                                </button>
                            )}
                            {commentObj.user.username === props.user.username && (
                                <button value={commentObj.id} className="edit" onClick={e => setEditingId((e.target as HTMLButtonElement).value)}>
                                    <img src="/images/icon-edit.svg" alt="" />
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className="content">{commentObj.content}</div>
                    </motion.div>
                )}
                {editingId === commentObj.id && (
                    <Edit
                        user={props.user as User}
                        comments={props.comments}
                        setComments={props.setComments}
                        parentId={parentID}
                        commentToEdit={commentObj}
                        index={index}
                        setEditingId={setEditingId}
                    />
                )}
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
                            {commentObj.replies?.map((reply, index) => {
                                return CommentTemplate(reply as Comment, index, commentObj.id);
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {deletingId !== "" && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3 className="modal-title">Delete comment</h3>
                        <p className="modal-text">Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                        <div className="modal-buttons">
                            <button className="modal-cancel" onClick={() => setDeletingId("")}>
                                NO, CANCEL
                            </button>
                            <button className="modal-delete" onClick={() => deleteComment(deletingId)}>
                                YES, DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {props.comments !== undefined &&
                props.comments.map((comment, index) => {
                    return CommentTemplate(comment, index);
                })}
        </>
    );
};

export default Comments;
