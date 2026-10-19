# Repd screenshots

Five phone captures. The markup for all five is already written in
`projects/repd/index.html`, sitting inside two HTML comments. Drop the files
here with these exact names, delete the comment markers around each block
(the `<!-- ... -->` lines), and they appear.

| File                   | Where it goes            | What it should show                                   |
| ---------------------- | ------------------------ | ----------------------------------------------------- |
| `home.png`             | Hero, under the title    | The home screen: next training day, streak, this week |
| `plan-1-describe.png`  | Plan flow, step 01       | The box where you describe or paste a plan            |
| `plan-2-building.png`  | Plan flow, step 02       | The app building the plan                             |
| `plan-3-approve.png`   | Plan flow, step 03       | The drafted plan, editable, with the approve button   |
| `plan-4-days.png`      | Plan flow, step 04       | The approved plan as training days                    |

## Before you drop them in

- **Size.** Capture at phone width. The markup declares `390x844`; if yours are
  a different shape, say so and the `width`/`height` attributes get corrected.
  Those two numbers only reserve the right space while the image loads, so a
  wrong pair causes layout shift.
- **Weight.** Keep each one under about 300 KB. A PNG screenshot straight off a
  phone is often 2 MB or more. `cwebp -q 80` or any exporter set to 80% quality
  gets it down without a visible difference on a 272px-wide frame.
- **WebP.** Optional. The hero block is written as a `<picture>` and will use
  `home.webp` if you add one, falling back to the PNG. The four plan shots are
  plain `<img>` tags; if you want WebP for those too, say so and they can be
  wrapped the same way.
- **Nothing personal in frame.** These go on a public page. Real names, real
  email addresses and anything else identifying should be out of shot or
  replaced before capture.

## Alt text

Every image already has alt text written for what the table above describes. If
a screenshot shows something different from its row, say what it actually
shows and the alt text gets rewritten to match. Alt text that describes the
wrong picture is worse than none.
