export type User = {
    firstname: string;
    lastname: string;
    email: string;
    address: Address[];
}

export type Address = {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}