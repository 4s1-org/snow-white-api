// Prevent all request to remote APIs by Axios.
export default {
  get: jest.fn((url: string) => {
    throw new Error(`GET request to ${url} not allowed while testing`)
  }),
}
