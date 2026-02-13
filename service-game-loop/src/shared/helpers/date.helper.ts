/**
 * Helper class for working with dates.
 */
export class DateHelper {
  /**
   * Get the current date and time.
   * @returns The current date and time.
   */
  public static getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Get a Date object from the provided milliseconds.
   * @param milliseconds The number of milliseconds since the Unix epoch.
   * @returns A Date object representing the provided milliseconds.
   */
  public static getDate(milliseconds: number): Date {
    const date = new Date(milliseconds);
    return date;
  }

  /**
   * Get an adjusted date by adding or subtracting milliseconds from the given date.
   * @param baseDate The date to which milliseconds should be added or subtracted.
   * @param milliseconds The number of milliseconds to add (if positive) or subtract (if negative).
   * @returns A new Date object representing the resulting adjusted date.
   */
  public static getAdjustedDate(baseDate: Date, milliseconds: number): Date {
    const adjustedDate = new Date(baseDate.getTime() + milliseconds);
    return adjustedDate;
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

  /**
   * Check if a given number of milliseconds is in the past.
   * @param milliseconds The number of milliseconds to check.
   * @returns True if the milliseconds represent a date in the past, false otherwise.
   */
  public static isMillisecondsInPast(milliseconds: number): boolean {
    const date = this.getDate(milliseconds);
    return this.isDateInPast(date);
  }
}
