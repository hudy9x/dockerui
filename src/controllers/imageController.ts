import { Request, Response } from 'express';
import docker from '../utils/docker';
import { PullImageBody, TypedRequest } from '../types';

export const listImages = async (req: Request, res: Response) => {
  try {
    const images = await docker.listImages();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list images' });
  }
};

export const pullImage = async (req: TypedRequest<PullImageBody>, res: Response) => {
  try {
    const stream = await docker.pull(req.body.imageName);
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err: Error | null) => {
        if (err) reject(err);
        else resolve(null);
      });
    });
    res.json({ message: 'Image pulled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to pull image' });
  }
};

export const removeImage = async (req: Request, res: Response) => {
  try {
    const image = docker.getImage(req.params.imageIdOrName);
    await image.remove({ force: true });
    res.json({ message: 'Image removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove image' });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const image = docker.getImage(req.params.imageIdOrName);
    const info = await image.inspect();
    res.json(info);
  } catch (error) {
    res.status(404).json({ error: 'Image not found' });
  }
}; 