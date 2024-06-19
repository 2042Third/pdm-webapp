
export interface c20 extends EmscriptenModule {
  loader_check(a:string,inp: string): string;
  loader_out(a:string,inp: string): string;
  get_hash(inp: string): string;

  create_context(a:string): number;
  destroy_context(handle:number): void;
  encrypt(handle:number, inp: string): string;
  decrypt(handle:number, inp: string): string;
}


