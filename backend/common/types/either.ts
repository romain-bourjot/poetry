export type Either<Success, Failure> =
  | { isFailure: true, failure: Failure }
  | { isFailure: false, value: Success }

export function assertNever (a: never): boolean {
  return true
}
