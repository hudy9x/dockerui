import { Request } from 'express';

export interface ContainerLogsQuery {
  follow?: boolean;
  stdout?: boolean;
  stderr?: boolean;
  timestamps?: boolean;
  since?: string | number;
  until?: string | number;
  tail?: number;
}

export interface ExecCreateBody {
  Cmd: string[];
}

export interface PullImageBody {
  imageName: string;
}

export interface DeployStackBody {
  composeFileContent: string;
}

export interface TypedRequest<T> extends Request {
  body: T;
} 