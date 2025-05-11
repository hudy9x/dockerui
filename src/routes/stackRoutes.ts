import { Router, RequestHandler } from 'express';
import {
  listStacks,
  deployStack,
  removeStack
} from '../controllers/stackController';

const router = Router();

router.get('/', listStacks as RequestHandler);
router.post('/:stackName', deployStack as RequestHandler);
router.delete('/:stackName', removeStack as RequestHandler);

export default router; 