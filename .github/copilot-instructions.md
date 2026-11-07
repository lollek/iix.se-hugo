# iix.se Hugo Site Instructions

## Project Layout

- This is a Hugo site deployed to GitHub Pages. CI builds with Hugo Extended 0.164.0 using `hugo --minify`.
- Write blog posts in `content/posts/`. Keep the existing numbered filename convention: `<number>-<slug>.md`.
- Post front matter is YAML. Preserve `title`, string `slug`, ISO `date`, string `categories`, and a YAML `tags` list. Use `new-post.sh "Title"` when creating a new post; it chooses the next number and opens the file for editing.
- Put reusable page templates in `layouts/`, styles and scripts processed by Hugo in `assets/`, and files copied directly to the site in `static/`.
- `.github/workflows/hugo.yml` deploys the static site to GitHub Pages on pushes to `master`; browser-side forms cannot persist changes without a separate integration.

## Coffee List

- `content/posts/203-coffee-beans.md` supplies the post metadata and introduction; its `coffee` layout renders entries from `data/coffee_beans.yaml` at `/posts/203/`.
- Each YAML record uses string fields `rating`, `bean`, `brand`, `cost`, and `comment`. Supported ratings are `Great`, `Good`, `Fine`, `Not great`, and an empty string for unrated; other values are not rendered by the current layout. `cost` is display text in SEK/kg, including `kr`; preserve blank and unknown values and duplicate entries.
- `layouts/_default/coffee.html` renders the list, `assets/js/coffee.js` handles search and rating filters, and `assets/css/extended/coffee.css` styles it. Keep entries readable without JavaScript and keep controls, rating groups, and data in sync.
- The site-wide search index is built by `layouts/_default/index.json` from page content, with an explicit addition for the coffee data. Update that addition if the coffee data schema changes so entries remain searchable.

## Working Conventions

- Preserve the existing Hugo template formatting and whitespace-control style (`{{-` / `-}}`) when editing layouts.
- Keep content edits focused. Do not modernize or change the meaning of older posts unless explicitly requested.
- Do not add generated `public/` files to commits; the directory is ignored and rebuilt in deployment.
- Avoid editing `resources/_gen/` unless the task specifically requires generated Hugo resource output.

## Validation

- Run `make build` to validate a production build locally. It uses the pinned Docker Compose image and requires Docker to be running.
- For local preview, run `make dev` and visit `http://localhost:1313`. The Compose service uses polling for reliable file watching through Docker Desktop on macOS.
- For coffee-page changes, check mobile and desktop layouts, search and rating filters (including unrated and no results), the no-JavaScript list, and coffee fields in the generated `public/index.json`.