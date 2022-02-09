import * as R from 'ramda'
interface Entity {
    id: string;
}

interface Post extends Entity {
    __tag: "post";
    userId: number;
    title: string;
    body: string;
}

interface Comment extends Entity {
    __tag: "comment";
    postId: number;
    name: string;
    email: string;
    body: string;
}

type ApiResponse<T extends Entity> =
    | { status: "success"; data: T[] }
    | { status: "error"; error: string };

/* 1 */
function fetchMockData(): Promise<ApiResponse<Post>>;
function fetchMockData(postId: number): Promise<ApiResponse<Comment>>;
function fetchMockData(postId?:number): Promise<ApiResponse<Post | Comment>> {

    if (postId === undefined) {
        return new Promise(resolve => {
            fetch('https://jsonplaceholder.typicode.com/posts/1')
                .then((response) => response.json())
                .then((json) => resolve({status: 'success', data: json as Post[]}))
                .catch(err => resolve({status: 'error', error: JSON.stringify(err)}));
        });
    } else {
        return new Promise(resolve => {
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
                .then((response) => response.json())
                .then((json) => resolve({status: 'success', data: json as Comment[]}))
                .catch(err => resolve({status: 'error', error: JSON.stringify(err)}));
        });
    }
}

/* 2 */
const fetchComments = R.partial(fetchMockData, ['comments'])
const fetchPosts = fetchMockData

async () => {
    const commentsRemoteData: ApiResponse<Comment> = await fetchComments(6)
    const postsRemoteData: ApiResponse<Post> = await fetchPosts()
}

/* 3 */
type Matcher <D> = {
    success: (data: D) => void;
    error: (error: string) => void
}
const match = <T extends Entity>(rd: ApiResponse<T>, matcher: Matcher<T[]>) => {
    if (rd.status === 'success'){
        matcher[rd.status](rd.data)
        return rd.data
    }else {
        matcher[rd.status](rd.error)
        return rd.error
    }
}

/* 4 */
async () => {
    const postsRemoteData: ApiResponse<Post> = await fetchPosts()
    match(postsRemoteData, {
        error: (err) => console.log('Error is', err),
        success: async (posts) => {
            console.log('All posts:', posts)
            if (posts.length > 0){
                // log first post's comments
                const commentsRemoteData: ApiResponse<Comment> = await fetchComments(posts[0].id) 
                match(commentsRemoteData, {
                    error: (err) => console.log('Error is', err),
                    success: (comments) => console.log(`Post ${posts[0].id}'s comments: `, comments)
                })
            }
        }
    })
}

/* 5 */
const application = async () => {
    const postsRemoteData: ApiResponse<Post> = await fetchPosts()
    match(postsRemoteData, {
        error: (err) => console.log('Error is', err),
        success: async (posts) => {
            // get user 1's posts comments count
            const user1posts = posts.filter(post => post.userId)
            const count = await user1posts.reduce(async (count, currentPost) => {
                const commentsRemoteData: ApiResponse<Comment> = await fetchComments(currentPost.id)
                const comments = match(commentsRemoteData, {
                    error: (err) => console.log('Error is', err),
                    success: (comments) => comments
                })
                if (Array.isArray(comments)){
                    return (await count) + comments.length
                }else {
                    return count
                }
            }, Promise.resolve(0))
        }
    })
}

/**
 * 1. We can use Either object to wrap the result. The result can be data or error message.
 * 
 * 2. This program can be written in a React application. The application can load posts/comments as user click/gavigate on pages. 
 * 
 * 3. The match function is pure. fetchMockData, fetchComments, fetchPosts, and application is impure
 * 
 * 4. RemoteData ADT
 * 
 */

type Success<T> = {
    tag: "success",
    data: T
}

type Error<E> = {
    tag: "error"
    error: E
}

type RemoteData<D, E> = Success<D> | Error<E>