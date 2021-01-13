export type IMiddlewareFunction = (
  // path to file is passed: "/home/acer/project/views/hello.hbs"
  path: string,

  // express options are passed such as 'env', 'x-powered-by', 'views'
  options: object,

  // A function you need to call with final string rendered on screen.
  callback: (e: any, rendered?: string | undefined) => void
) => void;
