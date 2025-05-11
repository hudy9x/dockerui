import express from 'express';
import cors from 'cors';
import containerRoutes from './routes/containerRoutes';
import imageRoutes from './routes/imageRoutes';
import stackRoutes from './routes/stackRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use('/containers', containerRoutes);
app.use('/images', imageRoutes);
app.use('/stacks', stackRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 