# Docker UI Application

This is a Node.js application containerized using Docker.

## Prerequisites

- Docker installed on your machine
- Node.js and pnpm installed locally (for development)

## Building the Docker Image

To build the Docker image, run:

```bash
docker build -t dockerui .
```

## Running the Container

To run the container:

```bash
docker run -p 3000:3000 dockerui
```

The application will be available at `http://localhost:3000`

## Development

### Local Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

### Building Locally

To build the application locally:

```bash
pnpm build
```

## Environment Variables

The following environment variables can be configured:

- `PORT`: The port the application runs on (default: 3000)
- `NODE_ENV`: The environment (default: production)

## Docker Commands

### List running containers
```bash
docker ps
```

### Stop a container
```bash
docker stop <container_id>
```

### View container logs
```bash
docker logs <container_id>
```

## Project Structure

```
.
├── Dockerfile          # Docker configuration
├── package.json        # Project dependencies and scripts
├── pnpm-lock.yaml     # Locked dependencies
└── dist/              # Built application files
```

## License

ISC 