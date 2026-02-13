# Vallintines 💕

A cute Valentine’s site that asks “Will you be my Valentine?” with a **Yes** button and a **No** button that moves away when she tries to click it. After she clicks **Yes**, a short success animation plays.

## Run it

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Open on your phone (same Wi‑Fi)

1. On your PC, run:
   ```bash
   npm run dev:phone
   ```
2. In the terminal you’ll see something like:
   ```text
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.xxx:5173/
   ```
3. On your phone, connect to the **same Wi‑Fi** as the PC, then open the **Network** URL in the browser (e.g. `http://192.168.1.xxx:5173/`).

If your PC has a firewall, it may ask to allow Node/Vite; allow it so the phone can connect.

## Build

```bash
npm run build
npm run preview
```

## What it does

- **Ask screen:** “Will you be my Valentine?” with **(Please say yes 💕)** and two buttons. The **No** button starts to the right of **Yes**.
- **No button:** When the cursor (or touch) gets close, the No button moves away to a random spot. It keeps moving until she clicks **Yes**.
- **Yes button:** Clicking it shows a **flower animation**: branches grow from the center and your 3 photos appear at the end of each branch like blooms.

## Your photos on the flower

Put your 3 images in the **`public`** folder so the flower can show them:

- `627643882_1567875071096922_8213328330945948446_n.jpg`
- `633889598_1545330409911644_2460598087201222235_n.jpg`
- `634318182_1226189532814495_1868138656139527503_n.jpg`

If you use different filenames, update the `PHOTOS` array in `src/App.jsx`.

Built with **React** and **Vite**.
