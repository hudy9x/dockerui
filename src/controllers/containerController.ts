import { Request, Response } from 'express';
import docker from '../utils/docker';
import { ContainerLogsQuery, ExecCreateBody, TypedRequest } from '../types';
import { ContainerLogsOptions } from 'dockerode';

export const listContainers = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const containers = await docker.listContainers({ all: true });
    
    if (status) {
      const filteredContainers = containers.filter(
        container => container.State.toLowerCase() === (status as string).toLowerCase()
      );
      return res.json(filteredContainers);
    }
    
    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list containers' });
  }
};

export const getContainer = async (req: Request, res: Response) => {
  try {
    const container = docker.getContainer(req.params.idOrName);
    const info = await container.inspect();
    res.json(info);
  } catch (error) {
    res.status(404).json({ error: 'Container not found' });
  }
};

export const startContainer = async (req: Request, res: Response) => {
  try {
    const container = docker.getContainer(req.params.idOrName);
    await container.start();
    res.json({ message: 'Container started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start container' });
  }
};

export const stopContainer = async (req: Request, res: Response) => {
  try {
    const container = docker.getContainer(req.params.idOrName);
    await container.stop();
    res.json({ message: 'Container stopped successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop container' });
  }
};

export const removeContainer = async (req: Request, res: Response) => {
  try {
    const container = docker.getContainer(req.params.idOrName);
    await container.remove({ force: true });
    res.json({ message: 'Container removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove container' });
  }
};

export const getContainerLogs = async (req: Request, res: Response) => {
  try {
    const container = docker.getContainer(req.params.idOrName);
    const follow = req.query.follow === 'true';
    const options: ContainerLogsOptions = {
      follow: follow,
      stdout: req.query.stdout !== 'false',
      stderr: req.query.stderr !== 'false',
      timestamps: req.query.timestamps === 'true',
      since: req.query.since as string | number,
      until: req.query.until as string | number,
      tail: req.query.tail ? parseInt(req.query.tail as string) : undefined
    };

    if (follow) {
      const stream = await container.logs({ ...options, follow: true });
      stream.pipe(res);
    } else {
      const logs = await container.logs({ ...options, follow: false });
      res.json({ logs: logs.toString() });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get container logs' });
  }
};

export const createExec = async (req: TypedRequest<ExecCreateBody>, res: Response) => {
  try {
    const container = docker.getContainer(req.params.idOrName);
    const exec = await container.exec({
      Cmd: req.body.Cmd,
      AttachStdout: true,
      AttachStderr: true
    });
    res.json({ execId: exec.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exec instance' });
  }
};

export const startExec = async (req: Request, res: Response) => {
  try {
    const exec = docker.getExec(req.params.execId);
    await exec.start({ hijack: true, stdin: true });
    res.json({ message: 'Exec instance started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start exec instance' });
  }
}; 