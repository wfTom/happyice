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
    console.log('Password.compare: Plain-text password:', password);
    console.log(
      'Password.compare: Hashed password from DB (this.value):',
      this.value
    );
    return bcrypt.compareSync(password, this.value);
  }
}
