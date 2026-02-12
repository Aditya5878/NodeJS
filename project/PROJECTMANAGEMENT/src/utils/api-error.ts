// export class ApiError<T = unknown> extends Error {
//   public readonly statusCode: number;
//   public readonly success: boolean;
//   public readonly errors: string[];
//   public readonly data: T | null;

//   constructor(
//     statusCode: number,
//     message: string = "Something went wrong",
//     errors: string[] = [],
//     data: T | null = null,
//     stack?: string
//   ) {
//     super(message);

//     this.statusCode = statusCode;
//     this.success = false;
//     this.errors = errors;
//     this.data = data;

//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }


export type ApiErrorItem =
  | string
  | { field: string; message: string };

export class ApiError<T = unknown> extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly errors: ApiErrorItem[];
  public readonly data: T | null;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: ApiErrorItem[] = [],
    data: T | null = null,
    stack?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
