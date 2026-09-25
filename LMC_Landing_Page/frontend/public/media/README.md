# 📁 Media Assets — How the Home Page Media Works

The **hero video and brand logo** are stored here and in `frontend/src/assets/`:

| Provided file   | Location                 | Used for                                                |
| --------------- | ------------------------ | ------------------------------------------------------- |
| `lmcfinal.mp4`  | `frontend/public/media/` | Home page hero video (served at `/media/lmcfinal.mp4`)  |
| `LMC_Buyer.png` | `frontend/src/assets/`   | Brand logo — Navbar, Intro, Footer                      |
| `logo-1.png` … `logo-6.png` | `frontend/public/media/` | Partner "Trusted by" strip (drop-in)       |

## 🎬 Replacing the hero video

The hero player uses `/media/lmcfinal.mp4` — i.e. this folder's `lmcfinal.mp4`.
To swap it, just replace that file (keeping the name) — it's picked up
automatically, no code change needed.

> **Tip:** mute + compress to keep it fast:
> `ffmpeg -i input.mp4 -an -vcodec libx264 -crf 26 -preset slow -vf scale=1280:-2 lmcfinal.mp4`

## 🏷️ Partner logos (`logo-1.png` … `logo-6.png`)

Shown in the **"Trusted by" strip** below the hero. The strip stays hidden until at least
one logo exists here.

| File name (exact) | Displayed as    | Recommended size |
| ----------------- | --------------- | ---------------- |
| `logo-1.png`      | Partner logo #1 | 240 × 80 px      |
| `logo-2.png`      | Partner logo #2 | 240 × 80 px      |
| `logo-3.png`      | Partner logo #3 | 240 × 80 px      |
| `logo-4.png`      | Partner logo #4 | 240 × 80 px      |
| `logo-5.png`      | Partner logo #5 | 240 × 80 px      |
| `logo-6.png`      | Partner logo #6 | 240 × 80 px      |

> **Tip:** export PNGs with transparent backgrounds; light marks look best on the dark theme.

## ✅ Checklist

- [x] Hero video served from `public/media/lmcfinal.mp4` (`/media/lmcfinal.mp4`)
- [x] Brand logo bundled (`LMC_Buyer.png` in `src/assets`)
- [ ] (Optional) Add partner logos `logo-1.png` … `logo-6.png` to this folder
