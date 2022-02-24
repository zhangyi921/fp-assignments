type Tree<A> = Leaf<A> | Branch<A>;
type ZippedTree<A> = ZippedLeaf<A> | ZippedBranch<A>

class Leaf<A> {
    tag: "leaf" = "leaf";
    readonly value: A;

    constructor(value: A) {
        this.value = value;
    }
}

// made left and right optional for easier filtering
class Branch<A> {
    tag: "branch" = "branch";
    readonly left?: Tree<A>;
    readonly right?: Tree<A>;

    constructor(leaves: { left?: Tree<A>, right?: Tree<A> }) {
        this.left = leaves.left;
        this.right = leaves.right;
    }
}

class ZippedLeaf<A> {
    tag: "leaf" = "leaf";
    readonly values: A[] = [];

    constructor(leaves: A[]) {
        this.values = leaves;
    }
}

class ZippedBranch<A> {
    tag: "branch" = "branch";
    readonly left?: ZippedTree<A>;
    readonly right?: ZippedTree<A>;
    readonly value?: A; // for zip a leaf with a branch

    constructor(leaves: { left?: ZippedTree<A>, right?: ZippedTree<A>, value?: A }) {
        this.left = leaves.left;
        this.right = leaves.right;
        this.value = leaves.value
    }
}

// type gruard
const isLeaf = <A>(tree: Tree<A>): tree is Leaf<A> => tree.tag === 'leaf'
const isBranch = <A>(tree: Tree<A>): tree is Branch<A> => tree.tag === 'branch'

// 1.
type SizeResult = { leaves: number, branch: number }
const size = <A>(tree: Tree<A>): SizeResult => {
    if (isBranch(tree)) {
        const leftSize: SizeResult = tree.left ? size(tree.left) : { leaves: 0, branch: 0 }
        const rightSize: SizeResult = tree.right ? size(tree.right) : { leaves: 0, branch: 0 }
        return {
            leaves: leftSize.leaves + rightSize.leaves,
            branch: leftSize.branch + rightSize.branch + 1
        }
    }
    return { leaves: 1, branch: 0 } // this is a leaf
}

// 2. undefined is returned when this tree has no leaf
const max = <A>(tree?: Tree<A>): A | undefined => {
    if (tree) {
        if (isBranch(tree)) {
            const leftMax = max(tree.left)
            const rightMax = max(tree.right)
            if (leftMax && rightMax) return leftMax > rightMax ? leftMax : rightMax
            return leftMax ? leftMax : rightMax ? rightMax : undefined // possibly return undefined here
        } else {
            return tree.value // this is a leaf
        }
    }
}

// 3.
const depth = <A>(tree: Tree<A>): number => {
    if (isBranch(tree)) {
        const leftDepth = tree.left ? depth(tree.left) + 1 : 0
        const rightDepth = tree.right ? depth(tree.right) + 1 : 0
        return leftDepth > rightDepth ? leftDepth : rightDepth
    }
    return 0 // this is a leaf
}

// 4.
const mapTree = <A, B>(f: (a: A) => B, tree: Tree<A>): Tree<B> => isBranch(tree) ?
    new Branch({
        left: tree.left ? mapTree(f, tree.left) : undefined,
        right: tree.right ? mapTree(f, tree.right) : undefined
    }) :
    new Leaf(f(tree.value))

// 5. Remove node(leaf) if condition is true
const filter = <A>(f: (a: A) => boolean, tree: Branch<A>): Branch<A> => new Branch({
    left: tree.left && isLeaf(tree.left) ? (f(tree.left.value) ? undefined : tree.left) : tree.left,
    right: tree.right && isLeaf(tree.right) ? (f(tree.right.value) ? undefined : tree.right) : tree.right
})

// 6. branch + branch = branch, leaf + leaf = leaf, branch + leaf = branch
const zip = <A>(tree1: Tree<A>, tree2?: Tree<A>): ZippedTree<A> => {
    if (!tree2) { // only tree1
        if (isLeaf(tree1)) {
            return new ZippedLeaf([tree1.value])
        } else {
            return new ZippedBranch({
                left: tree1.left ? zip(tree1.left) : undefined,
                right: tree1.right ? zip(tree1.right) : undefined
            })
        }
    } else { // zip tree1 an tree2
        if (isLeaf(tree1)) { // tree 1 is leaf
            if (isLeaf(tree2)) {
                return new ZippedLeaf([tree1.value, tree2.value])
            } else {
                return new ZippedBranch({
                    left: tree2.left ? zip(tree2.left) : undefined,
                    right: tree2.right ? zip(tree2.right) : undefined,
                    value: tree1.value
                })
            }
        } else { // tree 1 is branch
            return new ZippedBranch({
                left: tree1.left ? zip(tree1.left, isLeaf(tree2) ? tree2 : tree2.left) : undefined,
                right: tree1.right ? zip(tree1.right, isLeaf(tree2) ? tree2 : tree2.right) : undefined,
                value: isLeaf(tree2) ? tree2.value : undefined
            })
        }
    }

}