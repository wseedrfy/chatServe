export class product_from {
    userId: string;
    page:number;
    size:number;
    type: string;
}

export interface IResults<T> {
    code: number;
    message: string;
    data?: T[];
}

export class Results {
        code: number;
        message: string;
        data: object;
        page: number;
    }
