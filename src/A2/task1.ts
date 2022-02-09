// a. f: A -> [A] -> [A]
const concat = <A>(a: A, arr: A[]): A[] => arr.concat(a)
const concat2 = <A>(a: A): (arr: A[]) => A[] => {
    // implementation
    return (arr) => arr.concat(a)
}

// b. f: Number -> Number -> [A] -> [A]
const apply = <A>(num: number, f: (num: number) => A[]): A[] => f(num)
const swap = <A>(index1: number, index2: number): (arr: A[]) => A[] => {
    // implementation
    return (arr) => {
        const tempA: A = arr[index1]
        arr[index1] = arr[index2]
        arr[index2] = tempA
        return arr
    }
}
const swap2 = <A>(index1: number, index2: number, arr: A[]): A[] => {
    // implementation
    const tempA: A = arr[index1]
    arr[index1] = arr[index2]
    arr[index2] = tempA
    return arr
}

// c. f: [String] -> {String: any} -> {String: any}
const deleteProperty = (str: string, obj: Record<string, any>): Record<string, any> => {
    delete obj[str]
    return obj
}
const deleteProperty2 = (str: string): (obj: Record<string, any>) => Record<string, any> => {
    // implementation
    return (obj) => {
        delete obj[str]
        return obj
    }
}

// d. f: [A] → [B] → [[A,B]]
const createPair = <A, B>(a: A[], b: B[]): [A, B][] => a.map((a, i) => [a, b[i]])
const createPair2 = <A, B>(a: A[]): (b: B[]) => [A, B][] => {
    // implementation
    return (b) => a.map((a, i) => [a, b[i]])
}