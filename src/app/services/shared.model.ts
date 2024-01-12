export interface IGeneralResponse<T> {
  status?: number;
  json?: T;
  message?: string;
}

export interface IFile {
  name: string;
  data: File;
  inProgress: boolean;
  progress: number;
}
