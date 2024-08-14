export interface PreviewFile {
  extend?: string;
  src?: string;
  file?: File;
  musicList?: musicList;
  codeValue?:string,
  cmMode?: string,
}

interface musicList {
  name: string;
  artist: string;
  cover: string;
  url: string;
}
