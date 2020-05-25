export interface HelloService {
  sayHello(data: { ip?: string }): { hello: string };
  sayError(data: { ip?: string }): { hello: string };
  saySkip(data: { ip?: string }): { hello: string };
}
