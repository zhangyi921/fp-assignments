// a. f: A -> [A] -> [A]
const concat = <A>(a: A, arr: A[]): A[] => arr.concat(a)
const concat2 = <A>(a: A): (arr: A[]) => A[] => {
    return (arr) => arr.concat(a)
}

// b. f: Number -> Number -> [A] -> [A]
const applyTo = <A>(num: number, f: (num: number) => A[]): A[] => f(num)

const slice = <A>(start: number, end: number, arr: A[]): A[] => arr.slice(start, end)
const slice2 = <A>(start: number, end: number): (arr: A[]) => A[] => {
    return (arr) => arr.slice(start, end)
}

// c. f: [String] -> {String: any} -> {String: any}
const extractProperties = (keys: string[], obj: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {}
    keys.forEach(key => result[key] = obj[key])
    return result
}
const extractProperties2 = (keys: string[]): (obj: Record<string, any>) => Record<string, any> => {
    return (obj) => {
        const result: Record<string, any> = {}
        keys.forEach(key => result[key] = obj[key])
        return result
    }
}
const extractPropertiesImmutable = (keys: string[], obj: Record<string, any>): Record<string, any> => {
    const entries = keys.map(key => [key, obj[key]])
    return Object.fromEntries(entries);
}

// d. f: [A] → [B] → [[A,B]]
const createPair = <A, B>(a: A[], b: B[]): [A, B][] => a.map((a, i) => [a, b[i]])
const createPair2 = <A, B>(a: A[]): (b: B[]) => [A, B][] => {
    return (b) => a.map((a, i) => [a, b[i]])
}