# iix.se Hugo Site Instructions

## Project Layout

- This is a Hugo site deployed to GitHub Pages. CI builds with Hugo Extended 0.164.0 using `hugo --minify`.
- Write blog posts in `content/posts/`. Keep the existing numbered filename convention: `<number>-<slug>.md`.
- Post front matter is YAML. Preserve `title`, string `slug`, ISO `date`, string `categories`, and a YAML `tags` list. Use `new-post.sh "Title"` when creating a new post; it chooses the next number and opens the file for editing.
- Put reusable page templates in `layouts/`, styles and scripts processed by Hugo in `assets/`, and files copied directly to the site in `static/`.

## Working Conventions

- Preserve the existing Hugo template formatting and whitespace-control style (`{{-` / `-}}`) when editing layouts.
- Keep content edits focused. Do not modernize or change the meaning of older posts unless explicitly requested.
- Do not add generated `public/` files to commits; the directory is ignored and rebuilt in deployment.
- Avoid editing `resources/_gen/` unless the task specifically requires generated Hugo resource output.

## Validation

- Run `make build` to validate a production build locally. It uses the pinned Docker Compose image and requires Docker to be running.
- For local preview, run `make dev` and visit `http://localhost:1313`. The Compose service uses polling for reliable file watching through Docker Desktop on macOS.