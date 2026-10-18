# AGENTS.md

## overview

strata is a client-only theme for [dufs](https://github.com/sigoden/dufs). dufs is the server; strata is the single `index.html` it serves through `--assets`. dufs replaces two placeholders in it: `__INDEX_DATA__` with the current listing (base64 json) and `__ASSETS_PREFIX__` with the url its assets folder is served under (`/__dufs_v<version>__/`). the page then talks to dufs's http api (`?json`, `?q`, `?hash`, `?zip`, `PUT`, `PATCH` with `X-Update-Range: append`, `MOVE`, `MKCOL`, `DELETE`). nothing runs server-side.

requires dufs 0.46+. works at the host root or under `--path-prefix`: listing `href`s are relative to the prefix and dufs reports it as `uri_prefix`, which `main.tsx` passes to `set_prefix()`. build every url through `dir_url` / `entry_url` / `file_url` / `home_url`, and check the root with `is_root(href)`; never hard-code `'/'`.

## conventions

- `package.json` scripts are the only commands: `build` (typecheck, then `dist/index.html` and `dist/config.json`), `lint` / `lint:fix` (oxlint, type-aware), `format` / `format:check` (oxfmt), `ci` (clean install, format check, lint, build). the build fails unless `dist/index.html` contains `__INDEX_DATA__` and `__ASSETS_PREFIX__` exactly once each (checked in `vite.config.ts`). `vite build` runs with `--configLoader runner` because the config imports `src/` barrels, which the bundle loader flags. `.github/workflows/ci.yml` runs the format check, lint and build on pull requests to `main`; `release.yml` creates a github release whenever `v<package.json version>` doesn't exist yet, so bumping `version` is how you release. a release ships `dufs-strata.zip` (a `strata/` folder with `index.html` and `config.json`, extracted into the dufs themes folder), with notes generated from merged pull requests (`--generate-notes`), so changes should land through pull requests. push a version bump together with any workflow change in one push, or the run on the earlier commit releases the old version.
- grouping by layer, not feature: `components/` (one component per file; `dialogs/`, `file-list/`, `preview/` group related pieces), `hooks/` (state and effects, e.g. `useNavigation` for routing, cache, scroll and the unsaved guard), `services/` (everything that talks to the network: dufs api, `config.json`, credentials, chunked uploads), `common/` (pure helpers), `config/` (defaults, merge, validation), `errors/`, `types/`, `styles/`. `app.tsx` composes hooks and components and owns user actions; `main.tsx` boots. the vite plugin that bakes the default appearance (css variables, favicon, `<title>`, default theme) into `index.html` lives in `vite.config.ts`. readme images go in `assets/`.
- every folder has an `index.ts` barrel; import other folders through their barrel, siblings directly.
- file names are kebab-case. no role suffixes (`services/uploads.ts`, not `upload.service.ts`).
- named exports only, collected in one `export { … }` at the bottom of the file. the only default export is `vite.config.ts`.
- `snake_case` for variables, functions, parameters, object keys and our own props (`on_close`, `is_admin`). `PascalCase` for components and types. react-required names stay as react needs them: hooks are `useX`, dom props are camelCase (`onClick`, `className`). components that forward to the dom accept `className`.
- `type`, never `interface`. every type name ends in `Type`. all types live in `src/types/`.
- arrow functions everywhere; no `function` declarations.
- constants are `UPPER_SNAKE` at the top of the file that uses them.
- errors: throw a `BaseError` subclass named after the condition (`RequestFailed`, `UploadStalled`). call sites that can fail use `safe()` from `safe-wrapper` and check the `[error, result]` tuple instead of try/catch.
- user-facing copy is lowercase. no comments in code unless a constraint is non-obvious.
- no `console` (lint enforced).
- formatting is oxfmt's job: single quotes, semicolons, 2 spaces, 200 columns.

## config

configuration is read at runtime, not at build time. the build writes `dist/config.json` from `defaults_file()` (every key, default values) and releases ship it next to `index.html` inside `dufs-strata.zip`, so users see every option. the page fetches `__ASSETS_PREFIX__config.json` with `cache: 'no-cache'` (dufs marks assets `immutable`, so a plain fetch would never see edits). edits apply on the next page load without a rebuild or a dufs restart.

the defaults in `src/config/config.ts` are the single source of truth; never hand-write a config.json with values in the repo.

resolution is per key: a missing key uses its default, an unknown key or an invalid value is ignored on its own (that key keeps its default), and everything valid still applies. ignored entries are collected and shown in one toast (`config.json: ignored colors.dark.acent (unknown key), …`). a 404 means all defaults, silently; a network failure, timeout (1.5s) or invalid json means all defaults plus an error toast.

startup (`src/main.tsx`): `load_overrides()`, then `bootstrap(overrides)` (returns the ignored entries), then `apply_appearance()`, then render. the resolved appearance css is cached in `localStorage` (`strata-appearance`) and re-applied by the inline script in `index.html`, so repeat visits paint with the right colours.

keys: `title`, `theme` (`system` by default, `dark` or `light`; the inline script in `index.html` gets the code default via the `__DEFAULT_THEME__` placeholder, filled in by the plugin in `vite.config.ts`; a visitor's toggle choice in `strata-theme` wins, the configured default is cached in `strata-default-theme` for the inline script), `footer` (`{ text, label, href }` or `false`), `fonts` (`sans`, `mono` css stacks, `google`), `colors.dark` / `colors.light` (palettes of `#rrggbb`), `logo` (`"auto"`: cube coloured from `colors.dark.accent`, exact original tones for the default accent; a file name next to index.html, shown via `<img>` so it can't run script; or six tones), `upload.chunk_size` (bytes).

anything read from `config` must be read at call time, never at module load, because `bootstrap()` runs after imports. add a key by extending `ConfigType` / `OverridesType`, `DEFAULTS` and `resolve()` together; `defaults_file()` picks it up for the shipped file. never rename or remove a key without keeping the old one accepted, because users' files pin keys.

dufs serves the assets folder without authentication; never suggest putting anything private there.

## design rules

- one accent colour; everything else is greys. dark-first.
- minimal over clever: secondary actions live in the row menu / bottom sheet.
- root font size is 14px, so tailwind rem sizes are 12.5% smaller than the docs say. touch targets grow through the `tap` utility (already in `btn.base`), not bigger visuals.
- desktop (≥640px) pins header, toolbar and column headers; phones pin only the header.
- fixed bottom layers: selection bar z-30, upload panel z-40 (`raised` while the bar shows). account for both in anything new at the bottom.
- every view is a url (folders via pushState, previews via `?view=`), so back/forward must stay exact.

## testing

there are no code tests. verify every change in a real browser against a running dufs:

- build, copy `dist/index.html` into a scratch theme folder, and serve it on a spare port with a throwaway share folder. never use a real share, and never the port a real share or tunnel points at: `dufs /tmp/dufs-test -b 127.0.0.1 -p 8390 --assets /tmp/strata-theme -a 'user:pass@/:rw' -a '@/' --allow-all --hidden '.*'`
- dufs reads `index.html` at startup, so restart it after each build; `config.json` edits need only a reload.
- drive it with browser tools and check the flows the change touches, signed in and signed out: browse, sort, search, breadcrumbs, back/forward, previews (image, video, audio, pdf, markdown, code, unknown), edit + save + unsaved-changes guard, new file/folder, rename, delete, multi-select, zip download, upload (files, folders, drag and drop, overwrite prompt), chunked upload above `chunk_size` with a mid-transfer server restart, cancel and retry.
- check desktop (1280px) and phone (390px) widths, dark and light, with no `config.json`, a valid one, and an invalid one.
- for url changes, also run dufs with `--path-prefix /files` and repeat the flows under it.
- phone emulation only takes effect in background (not visible) preview tabs; confirm `innerWidth` before every screenshot.
- for refactors, build the previous version too, serve both, and diff layout and rendered text per route; any difference must be intended. `localStorage` is per origin (port), so clear it in both before comparing.
- report what was verified and what wasn't.
