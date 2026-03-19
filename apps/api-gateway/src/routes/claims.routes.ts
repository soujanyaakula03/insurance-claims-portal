import { Router } from 'express';
import axios from 'axios';
import { Request, Response } from 'express';

const claimsServiceUrl = process.env.CLAIMS_SERVICE_URL || 'http://localhost:3001';

export const claimsRouter = Router();

function buildHeaders(req: Request) {
  return {
    'x-user-id': req.headers['x-user-id'],
    'x-user-email': req.headers['x-user-email'],
    'x-user-role': req.headers['x-user-role'],
    'Content-Type': 'application/json',
  };
}

claimsRouter.get('/summary', async (req: Request, res: Response) => {
  const { data } = await axios.get(`${claimsServiceUrl}/claims/summary`, { headers: buildHeaders(req) });
  res.json(data);
});

claimsRouter.get('/', async (req: Request, res: Response) => {
  const { data } = await axios.get(`${claimsServiceUrl}/claims`, {
    headers: buildHeaders(req),
    params: req.query,
  });
  res.json(data);
});

claimsRouter.get('/:id', async (req: Request, res: Response) => {
  const { data } = await axios.get(`${claimsServiceUrl}/claims/${req.params.id}`, { headers: buildHeaders(req) });
  res.json(data);
});

claimsRouter.post('/', async (req: Request, res: Response) => {
  const { data } = await axios.post(`${claimsServiceUrl}/claims`, req.body, { headers: buildHeaders(req) });
  res.status(201).json(data);
});

claimsRouter.patch('/:id', async (req: Request, res: Response) => {
  const { data } = await axios.patch(`${claimsServiceUrl}/claims/${req.params.id}`, req.body, { headers: buildHeaders(req) });
  res.json(data);
});

claimsRouter.delete('/:id', async (req: Request, res: Response) => {
  await axios.delete(`${claimsServiceUrl}/claims/${req.params.id}`, { headers: buildHeaders(req) });
  res.status(204).send();
});
