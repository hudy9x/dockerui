import { Request, Response } from 'express';
import docker from '../utils/docker';
import { DeployStackBody, TypedRequest } from '../types';

export const listStacks = async (req: Request, res: Response) => {
  try {
    const services = await docker.listServices();
    const stacks = new Set<string>();
    
    services.forEach(service => {
      const labels = service.Spec?.Labels || {};
      const stackName = labels['com.docker.stack.namespace'];
      if (stackName) {
        stacks.add(stackName);
      }
    });
    
    res.json(Array.from(stacks));
  } catch (error) {
    res.status(500).json({ error: 'Failed to list stacks' });
  }
};

export const deployStack = async (req: TypedRequest<DeployStackBody>, res: Response) => {
  try {
    const { stackName } = req.params;
    const { composeFileContent } = req.body;
    
    // Note: This is a simplified implementation
    // In a real-world scenario, you would need to:
    // 1. Parse the compose file
    // 2. Create/update services based on the compose file
    // 3. Handle networks and volumes
    // 4. Manage stack labels
    
    res.json({ message: 'Stack deployment initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deploy stack' });
  }
};

export const removeStack = async (req: Request, res: Response) => {
  try {
    const { stackName } = req.params;
    
    // Get all services in the stack
    const services = await docker.listServices();
    const stackServices = services.filter(service => {
      const labels = service.Spec?.Labels || {};
      return labels['com.docker.stack.namespace'] === stackName;
    });
    
    // Remove all services in the stack
    await Promise.all(stackServices.map(service => 
      docker.getService(service.ID).remove()
    ));
    
    res.json({ message: 'Stack removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove stack' });
  }
}; 