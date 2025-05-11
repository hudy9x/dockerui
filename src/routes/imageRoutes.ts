import { Router } from 'express';
import {
  listImages,
  pullImage,
  removeImage,
  getImage
} from '../controllers/imageController';

const router = Router();

router.get('/', listImages);
router.post('/pull', pullImage);
router.delete('/:imageIdOrName', removeImage);
router.get('/:imageIdOrName', getImage);

export default router; 