# iix.se - A Hugo homepage

A blog/notes page built with Hugo Extended 0.164.0.

## Requirements

Docker Desktop with Docker Compose.

## Development

Start the live-reload server:

```bash
make dev
```

Visit http://localhost:1313. Hugo polls every 700 ms so rebuilds work reliably through Docker Desktop's macOS file mount.

Build the production site:

```bash
make build
```
