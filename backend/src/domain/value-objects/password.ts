import * as bcrypt from 'bcryptjs';

export class Password {
    private constructor(public readonly value: string) {}

    public static create(value: string, isHashed: boolean = false): Password {
        if (isHashed) {
            return new Password(value);
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(value, salt);
        return new Password(hashedPassword);
    }

    public compare(password: string): boolean {
        return bcrypt.compareSync(password, this.value);
    }
}
