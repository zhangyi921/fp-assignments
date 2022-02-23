type CustomOmit<T, Keys> = {
    [K in Exclude<keyof T, Keys>]: T[K]
};

type CustomPick<T, Keys> = {
    [K in Extract<keyof T, Keys>]: T[K]
};

type CustomPartical<T> = {
    [K in keyof T]?: T[K]
}

type CustomRequired<T> = {
    [K in keyof T]-?: T[K]
}




interface Props {
    a?: number;
    b?: string;
}

type keys = keyof Props
type z = {
    [K in keyof Props]: Exclude<Props[K], undefined>
}
type z2 = {
    [K in keys]: Exclude<Props[K], undefined>
}

type test = CustomRequired<Props>

const obj2: CustomRequired<Props> = { a: 5 };

interface xyz {
    x: number;
    y: number;
    z: number;
}

type abc = CustomPartical<xyz>
const ddd: CustomPartical<xyz> = {x: 4}