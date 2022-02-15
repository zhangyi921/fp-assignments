// constructors
class NotStarted {
    readonly tag = 'NotStarted';
}
class Finished<T> {
    readonly tag = 'Finished';
    val: T;
    constructor(val: T) {
        this.val = val
    }
    // access methods
    getVal() {
        return this.val
    }
}
class Progress<P> {
    readonly tag = 'Progress';
    val: P;
    constructor(val: P) {
        this.val = val
    }
    // access methods
    getVal() {
        return this.val
    }
}

// discriminated union
type ProgressData = { val: number }
type ProgressOption<T> = NotStarted | Finished<T> | Progress<ProgressData>;

// typeguards
const isNotStarted = <T>(option: ProgressOption<T>): option is NotStarted => option.tag === 'NotStarted'
const isFinished = <T>(option: ProgressOption<T>): option is Finished<T> => option.tag === 'Finished'
const isProgress = <T>(option: ProgressOption<T>): option is Progress<ProgressData> => option.tag === 'Progress'

const fold = <T>(option: ProgressOption<T>, f: () => T): T => isFinished(option) ? option.getVal() : f()

// helper methods
const map = <T, U>(option: ProgressOption<T>, f: (t: T) => U, g: (p: ProgressData) => ProgressData): ProgressOption<U> => {
    if (isNotStarted(option)) {
        return new NotStarted()
    } else if (isProgress(option)) {
        return new Progress(g(option.getVal()))
    } else {
        return new Finished(f(option.getVal()))
    }
}
const contain = <T>(option: ProgressOption<T>, t: T): boolean => isFinished(option) && option.getVal() === t


const partialMatch = <T, T2>(option: ProgressOption<T>, f: (t: T) => T2, noData: () => T2): T2 => isFinished(option) ? f(option.getVal()) : noData()