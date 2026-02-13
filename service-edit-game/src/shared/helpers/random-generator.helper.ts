import { randomBytes } from 'crypto';

export class RandomGeneratorHelper {
  private static readonly CHARSET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  public static generateRandomAlphanumeric(length: number): string {
    const bytes = randomBytes(length);
    const charsetLength = RandomGeneratorHelper.CHARSET.length;

    const randomChars = new Array(length);
    for (let i = 0; i < length; i++) {
      randomChars[i] = RandomGeneratorHelper.CHARSET[bytes[i] % charsetLength];
    }

    return randomChars.join('');
  }
}
