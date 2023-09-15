declare module 'download-git-repo' {
  interface Options {
    clone?: boolean;
    headers?: Record<string, string>;
  }
  function download(repo: string, dest: string, opts: Options): Promise<void>;
  function download(
    repo: string,
    dest: string,
    opts: Options,
    cb: (err?: Error) => void,
  ): Promise<void>;

  export = download;
}
