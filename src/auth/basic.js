

export const basicAuthMiddleware = (req, res, next) => {

  // 1. Check if Authorization header is received, if it is not --> trigger an error (401)

  // 2. Extract credentials from the Authorization header (they are in base64 --> string)

  // 3. Check the validity of credentials, if they are not valid --> trigger an error (401)

  // 4. Proceed to the route handler if credentials are fine

}