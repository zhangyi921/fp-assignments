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


// type fetchPosts = (type: 'posts') => Promise<Post[]>
// type fetchComments = (type: 'comments') => Promise<Comment[]>
// const fetchMockData: fetchPosts | fetchComments = async (type) => {
//     if (type === )
// }
// const fetchMockData = async <T, K>(type) => {
//     if (type === )
// }

function fetchMockData(getPosts: 'posts'): Promise<Post[]>;
function fetchMockData(getComments: 'comments'): Promise<Comment[]>;
function fetchMockData(type) {

  if (type === 'posts'){
    return new Promise(resolve => {
        setTimeout(() => {
          resolve([] as Comment[]);
        }, 2000);
      });
  }else {
    return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 2000);
      });
  }
}

const f = async () => {
    const reuslt = await fetchMockData('posts')
}