/**
 * This code is taken from yd-buyer src/blog/containers/BlogArticleCommentsContainer.tsx
 * Problem: Many components/pages require user object and need to check if use if logged in everytime
 * Solution: Use a higher order component that checks if use is logged in.
 * It actually works but with type warning. Somehow I can't get authenticated user object's type right.
 */

import { isAuthenticated } from "@vividtheory/ha-common";
import { __AuthenticatedUser, BlogComment } from "@vividtheory/yd-backend";
import { ComponentType, memo, useState } from "react";
import { useDispatch } from "react-redux";
import { compose } from "redux";
import { actions as modalActions } from "../../modal/redux/model";
import { useAuthenticatedUser } from "../../user/redux/hooks";
import { useSubmittingComment } from "../hooks";
import { actions as articleActions } from "../redux/model";
import BlogArticleComments from "../views/BlogArticleComments";

// ============= WAS ==============

interface IComments {
    readonly articleId: number;
    readonly comments: readonly BlogComment[];
}

const BlogArticleCommentsContainer = ({ articleId, comments }: IComments) => {
    const dispatch = useDispatch();
    const submitting = useSubmittingComment();
    const authenticatedUser = useAuthenticatedUser();
    const createComment = compose(
        dispatch,
        articleActions.createBlogComment.request
    );

    const handleSignIn = compose(dispatch, modalActions.openLoginModal);

    const [textField, setTextField] = useState("");

    const handleCreateComment = () => {
        if (isAuthenticated(authenticatedUser)) {
            createComment({
                authenticatedUser,
                inputBlogComment: {
                    comment: textField,
                    fkBlogArticleId: articleId,
                },
            });
            setTextField("");
        } else {
            handleSignIn("Sign in to leave a comment.");
        }
    };

    return (
        <BlogArticleComments
            comments={comments}
            textField={textField}
            user={authenticatedUser}
            handleCreateComment={handleCreateComment}
            handleTextChange={(str: string) => setTextField(str)}
            disableButton={textField === ""}
            submitting={submitting}
        />
    );
};

// ============= NEW IMPLEMENTATION ==============

function withUser<T>(WrappedComponent: ComponentType<T>) {
    return ({ ...props }: T) => {
        const authenticatedUser = useAuthenticatedUser();
        const getUser = (callbacks: {signedIn: (user: __AuthenticatedUser) => void; notSignedIn: () => void}) => {
            if (isAuthenticated(authenticatedUser)) {
                callbacks.signedIn(authenticatedUser)
            }else {
                callbacks.notSignedId()
            }
        }
        return <WrappedComponent getUser={getUser} user={authenticatedUser} {...props} />;
    };
}

interface IComments2 {
    readonly articleId: number;
    readonly comments: readonly BlogComment[];
    readonly getUser: (callbacks: {signedIn: (user: __AuthenticatedUser) => void; notSignedIn: () => void}) => void;
    readonly user: AnonymousUser
}

const BlogArticleCommentsContainer2 = ({ articleId, comments, getUser, user }: IComments2) => {
    const dispatch = useDispatch();
    const submitting = useSubmittingComment();
    // Not needed
    // const authenticatedUser = useAuthenticatedUser(); 
    const createComment = compose(
        dispatch,
        articleActions.createBlogComment.request
    );

    // Not needed
    // const handleSignIn = compose(dispatch, modalActions.openLoginModal); 

    const [textField, setTextField] = useState("");

    // no need to do the if check
    const handleCreateComment = () => {
        getUser({
            signedIn: (user) => {
                createComment({
                    user,
                    inputBlogComment: {
                        comment: textField,
                        fkBlogArticleId: articleId,
                    },
                });
                setTextField("");
            },
            notSignedIn: () => {
                handleSignIn("Sign in to leave a comment.");
            }
        })
    };

    return (
        <BlogArticleComments
            comments={comments}
            textField={textField}
            user={user}
            handleCreateComment={handleCreateComment}
            handleTextChange={(str: string) => setTextField(str)}
            disableButton={textField === ""}
            submitting={submitting}
        />
    );
};

export default memo(withUser(BlogArticleCommentsContainer2));
