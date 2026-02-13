import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper class for generating random alphanumeric strings.
 */
export class RandomGeneratorHelper {
  // Define the character set for generating random strings.
  private static readonly CHARSET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  /**
   * Generate a random alphanumeric string of the specified length.
   * @param length The length of the generated string.
   * @returns A random alphanumeric string.
   */
  public static generateRandomAlphanumeric(length: number): string {
    // Generate random bytes.
    const bytes = randomBytes(length);
    const charsetLength = RandomGeneratorHelper.CHARSET.length;

    // Map bytes to characters from the character set.
    const randomChars = new Array(length);
    for (let i = 0; i < length; i++) {
      randomChars[i] = RandomGeneratorHelper.CHARSET[bytes[i] % charsetLength];
    }

    // Join the characters to form the final random string.
    return randomChars.join('');
  }

  public static generateUUID(): string {
    return uuidv4();
  }
}
