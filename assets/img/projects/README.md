# Project images

Drop screenshots here, then tell Claude the filenames and which project each
belongs to. Nothing on the site references this folder yet, so adding a file
changes nothing until the markup is wired up.

## Naming

Use the project's slug, which is its folder name under `projects/`:

| Project                              | Slug                        |
| ------------------------------------ | --------------------------- |
| Swaswasthya Wellness Platform        | `swaswasthya`               |
| Cluckin Dashboard                    | `cluckin`                   |
| Duplicate Ticket Detection Model     | `jira-duplicate-detection`  |
| Translation QA Workflow              | `translation-qa-workflow`   |
| 404Found                             | `404found`                  |
| AI-Assisted Fitness Coaching         | `fitness-coaching-platform` |
| Crave                                | `crave`                     |
| Human Anatomy Explorer               | `human-anatomy`             |

- **Card thumbnail** (one per project): `<slug>.jpg`
  e.g. `crave.jpg`
- **Detail images** (as many as you like, shown on the case study page):
  `<slug>-1.jpg`, `<slug>-2.jpg`, …
  e.g. `human-anatomy-1.jpg`, `human-anatomy-2.jpg`

`.png` is fine too. Keep the extension consistent per project.

## Sizes

- **Thumbnails**: around 800x600, landscape. They render small on the card, so
  crop to the one thing worth seeing rather than the whole screen.
- **Detail images**: 1600px on the long edge is plenty. Anything larger gets
  downscaled anyway and just costs load time.
- Under ~400KB each if you can. Screenshots compress well as JPEG at quality 80.

## Before uploading

- Crop out anything confidential: client names, real customer data, internal
  URLs, email addresses in a sidebar.
- **Nothing for `fitness-coaching-platform`** — that project is marked
  confidential on the site and carries a note saying there are no screenshots
  to share. An image would contradict it.
- **Nothing for `cluckin`** either unless the numbers are fake: its page
  already says the dashboards are built on the client's own operational data
  and are not shareable.
