export class DateHelper {
  /**
   * Get the current date and time.
   * @returns The current date and time.
   */
  public static getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Check if a given date is in the future.
   * @param date The date to check.
   * @returns True if the date is in the future, false otherwise.
   */
  public static isDateInFuture(date: Date): boolean {
    return date > this.getCurrentDate();
  }

  /**
   * Check if a given date is in the past.
   * @param date The date to check.
   * @returns True if the date is in the past, false otherwise.
   */
  public static isDateInPast(date: Date): boolean {
    return date < this.getCurrentDate();
  }
}
