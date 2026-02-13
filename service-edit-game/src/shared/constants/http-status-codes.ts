export class HttpStatusCodes {
  // Informational (1xx) - The server acknowledges the client's request and continues to process it.
  public static readonly CONTINUE: number = 100; // The server has received the initial part of the request and has not rejected it; client should continue sending the rest of the request.
  public static readonly SWITCHING_PROTOCOLS: number = 101; // The server agrees to switch protocols and has upgraded the client's connection.

  // Success (2xx) - The client's request was successfully received, understood, and accepted.
  public static readonly OK: number = 200; // The request has succeeded, and the server has returned a response.
  public static readonly CREATED: number = 201; // The request has been fulfilled, resulting in the creation of a new resource.
  public static readonly ACCEPTED: number = 202; // The request has been accepted for processing, but the processing has not been completed.
  public static readonly NO_CONTENT: number = 204; // The request has succeeded, but there is no additional information to send; typically used for DELETE operations.

  // Redirection (3xx) - The client needs to take additional action to complete the request.
  public static readonly MULTIPLE_CHOICES: number = 300; // The requested resource has multiple choices, each with different locations; user choice is required.
  public static readonly MOVED_PERMANENTLY: number = 301; // The requested resource has been permanently moved to a different location; update bookmarks.
  public static readonly FOUND: number = 302; // The requested resource has been temporarily moved to a different location; future requests should use the original URL.
  public static readonly SEE_OTHER: number = 303; // The response to the request can be found under a different URL; use GET to retrieve the response.
  public static readonly NOT_MODIFIED: number = 304; // The requested resource has not been modified since the specified date; use cached version.
  public static readonly USE_PROXY: number = 305; // The requested resource must be accessed through the proxy specified in the Location header; deprecated.
  public static readonly TEMPORARY_REDIRECT: number = 307; // The requested resource has been temporarily moved to a different location; maintain the request method.
  public static readonly PERMANENT_REDIRECT: number = 308; // The requested resource has been permanently moved to a different location; maintain the request method.

  // Client Error (4xx) - The server cannot fulfill the client's request due to an error.
  public static readonly BAD_REQUEST: number = 400; // The server cannot process the request due to a client error, such as malformed request syntax or invalid parameters.
  public static readonly UNAUTHORIZED: number = 401; // The client must authenticate to gain access to the requested resource.
  public static readonly FORBIDDEN: number = 403; // The client does not have permission to access the requested resource.
  public static readonly NOT_FOUND: number = 404; // The server cannot find the requested resource.
  public static readonly METHOD_NOT_ALLOWED: number = 405; // The HTTP method used in the request is not allowed for the requested resource.
  public static readonly CONFLICT: number = 409; // The request could not be completed due to a conflict with the current state of the target resource.
  public static readonly UNPROCESSABLE_ENTITY: number = 422; // The server understands the content type of the request entity but was unable to process the contained instructions.

  // Server Error (5xx) - The server encountered an error while processing the client's request.
  public static readonly INTERNAL_SERVER_ERROR: number = 500; // The server encountered an unexpected condition that prevented it from fulfilling the request.
  public static readonly NOT_IMPLEMENTED: number = 501; // The server does not support the functionality required to fulfill the request.
  public static readonly BAD_GATEWAY: number = 502; // The server, while acting as a gateway or proxy, received an invalid response from an upstream server.
  public static readonly SERVICE_UNAVAILABLE: number = 503; // The server is temporarily unable to handle the request, usually due to maintenance or overload.
  public static readonly GATEWAY_TIMEOUT: number = 504; // The server, acting as a gateway or proxy, did not receive a timely response from an upstream server.

  // Add additional status codes here if needed
}
