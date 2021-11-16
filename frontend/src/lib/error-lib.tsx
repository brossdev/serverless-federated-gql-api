type ErrorWithMessage = {
  message: string;
};

type CognitoError = {
  name: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function isCognitoError(error: unknown): error is CognitoError {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as Record<string, unknown>).name === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  if (isCognitoError(maybeError))
    return new Error(JSON.stringify(maybeError.name));

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

const utils = { getErrorMessage };

export default utils;
