type Tree<A> = Leaf<A> | Branch<A>;

class Leaf<A> {
    tag: "leaf" = "leaf";
    readonly value: A;

    constructor(value: A) {
        this.value = value;
    }
}

class ZippedLeaf<A> {
    tag: "leaf" = "leaf";
    readonly values: A[];

    constructor(value: A, value2: A) {
        this.values = [value, value2];
    }
}

class Branch<A> {
    tag: "branch" = "branch";
    readonly left: Tree<A>;
    readonly right: Tree<A>;

    constructor(left: Tree<A>, right: Tree<A>) {
        this.left = left;
        this.right = right;
    }
}

const isLeaf = <A>(tree: Tree<A>): tree is Leaf<A> => tree.tag === 'leaf'
const isBranch = <A>(tree: Tree<A>): tree is Branch<A> => tree.tag === 'branch'

// 1.
const size = <A>(tree: Tree<A>): { leaves: number, branch: number } => {
    if (isBranch(tree)) {
        return {
            leaves: size(tree.left).leaves + size(tree.right).leaves,
            branch: 1 + size(tree.left).branch + size(tree.right).branch
        }
    }
    return { leaves: 1, branch: 0 }
}

// 2.
const max = <A>(tree: Tree<A>): A => {
    if (isBranch(tree)) {
        const leftMax = max(tree.left)
        const rightMax = max(tree.right)
        return leftMax > rightMax ? leftMax : rightMax
    }
    return tree.value
}

// 3.
const depth = <A>(tree: Tree<A>): number => {
    if (isBranch(tree)) {
        const leftDepth = depth(tree.left) + 1
        const rightDepth = depth(tree.right) + 1
        return leftDepth > rightDepth ? leftDepth : rightDepth
    }
    return 1
}

// 4.
const mapTree = <A, B>(f: (a: A) => B, tree: Tree<A>): Tree<B> => {
    if (isBranch(tree)) {
        return new Branch(mapTree(f, tree.left), mapTree(f, tree.right))
    }
    return new Leaf(f(tree.value))
}

// 5. Remove node if condition is true
const filter = <A> (f: (a: A) => boolean, tree: Tree<A>): Tree<A> => {
    if (isBranch(tree)){
        return new Branch(filter(f, tree.left), filter(f, tree.right))
    }

}

// 6. 
const zip = <A> (tree1: Tree<A>, tree2: Tree<A>): Tree<[A, A]> => {
    
}