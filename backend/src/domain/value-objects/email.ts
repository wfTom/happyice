export class Email {
  private constructor(public readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Formato de email inválido.');
    }
  }

  public static create(value: string): Email {
    return new Email(value);
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
