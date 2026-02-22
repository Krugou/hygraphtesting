import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (_req: Request, res: Response) => res.send({ status: 'ok' }));

export default router;
