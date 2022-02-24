// 1.
type CustomOmit<T, Keys> = {
    [K in Exclude<keyof T, Keys>]: T[K]
};

// 2.
type CustomPick<T, Keys> = {
    [K in Extract<keyof T, Keys>]: T[K]
};

// 3.
type CustomPartical<T> = {
    [K in keyof T]?: T[K]
}

type CustomRequired<T> = {
    [K in keyof T]-?: T[K]
}

// 4.
type X = {
    x: string;
    y: string;
    z: string;
}

interface Y extends X {
    s: string;
    t: string;
    u: string;
}

type Z = CustomOmit<Y, keyof X>