export type Card<T = {}> = {
    id: string;
    pos: number;
} & T;