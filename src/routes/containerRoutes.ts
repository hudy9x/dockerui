import { Router, RequestHandler } from 'express';
import {
  listContainers,
  getContainer,
  startContainer,
  stopContainer,
  removeContainer,
  getContainerLogs,
  createExec,
  startExec,
  getContainerStatus
} from '../controllers/containerController';

const router = Router();

router.get('/', listContainers as RequestHandler);
router.get('/:idOrName', getContainer as RequestHandler);
router.get('/:idOrName/status', getContainerStatus as RequestHandler);
router.post('/:idOrName/start', startContainer as RequestHandler);
router.post('/:idOrName/stop', stopContainer as RequestHandler);
router.delete('/:idOrName', removeContainer as RequestHandler);
router.get('/:idOrName/logs', getContainerLogs as RequestHandler);
router.post('/:idOrName/exec', createExec as RequestHandler);
router.get('/exec/:execId/start', startExec as RequestHandler);

export default router; 