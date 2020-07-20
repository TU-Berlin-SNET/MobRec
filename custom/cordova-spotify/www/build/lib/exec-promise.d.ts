/**
 * Cordova's exec with Promise and error handling support.
 *
 * @param methodName the native method to execute
 * @param args method arguments
 * @hidden
 */
export default function <T>(methodName: string, args?: any[]): Promise<T>;
