import { Request, Response } from 'express';
import docker from '../utils/docker';
import { PullImageBody, TypedRequest } from '../types';

export const listImages = async (req: Request, res: Response) => {
  try {
    const [images, containers] = await Promise.all([
      docker.listImages(),
      docker.listContainers({ all: true })
    ]);

    const imagesWithUsage = images.map(image => {
      const isInUse = containers.some(container => {
        // Container's ImageID includes "sha256:" prefix, so we need to check both formats
        const containerImageId = container.ImageID.replace('sha256:', '');
        return image.Id.includes(containerImageId) || containerImageId.includes(image.Id);
      });

      return {
        ...image,
        isInUse
      };
    });

    res.json(imagesWithUsage);
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
    res.status(500).json({ error: 'Failed to pull image', message: (error as Error).message });
  }
};

export const removeImage = async (req: Request, res: Response) => {
  try {
    const image = docker.getImage(req.params.imageIdOrName);
    await image.remove({ force: true });
    res.json({ message: 'Image removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove image', message: (error as Error).message });
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