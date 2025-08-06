import { Email } from "../value-objects/email";
import { Password } from "../value-objects/password";

export class User {
    constructor(
        public readonly id: string,
        public readonly email: Email,
        public readonly password: Password,
        public readonly createdAt: Date
    ) {}
}
