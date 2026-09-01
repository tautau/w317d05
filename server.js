import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>w317d05 — Build Your City</title>
  <style>
    :root {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #18232a;
      background: #dff1e5;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 10%, rgba(255,255,255,.9), transparent 30%),
        linear-gradient(135deg, #cce8d4 0%, #eff7eb 50%, #bddbc5 100%);
    }
    .scene {
      position: relative;
      width: min(1100px, 92vw);
      padding: 72px 72px 64px;
      border: 1px solid rgba(24, 35, 42, .1);
      border-radius: 32px;
      background: rgba(255,255,255,.84);
      box-shadow: 0 30px 90px rgba(38, 69, 54, .18);
      backdrop-filter: blur(14px);
      overflow: hidden;
    }
    .sun {
      position: absolute;
      width: 220px;
      height: 220px;
      top: -90px;
      right: -60px;
      border-radius: 50%;
      background: #f7d77c;
      opacity: .75;
    }
    .grid {
      position: absolute;
      inset: 0;
      opacity: .18;
      background-image:
        linear-gradient(rgba(24,35,42,.14) 1px, transparent 1px),
        linear-gradient(90deg, rgba(24,35,42,.14) 1px, transparent 1px);
      background-size: 28px 28px;
      transform: perspective(700px) rotateX(58deg) scale(1.45) translateY(35%);
      transform-origin: bottom center;
    }
    .content { position: relative; z-index: 2; max-width: 690px; }
    .eyebrow {
      display: inline-flex;
      padding: 7px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .14em;
      text-transform: uppercase;
      background: #203239;
      color: #f5f3e9;
    }
    h1 {
      margin: 22px 0 12px;
      font-size: clamp(56px, 9vw, 108px);
      line-height: .9;
      letter-spacing: -.06em;
    }
    .tagline {
      margin: 0;
      max-width: 600px;
      font-size: clamp(20px, 3vw, 30px);
      line-height: 1.25;
      color: #3a5358;
    }
    .status {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-top: 34px;
      font-size: 14px;
      color: #52676b;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #63a86f;
      box-shadow: 0 0 0 5px rgba(99,168,111,.14);
    }
    .city {
      position: absolute;
      z-index: 1;
      right: 52px;
      bottom: 34px;
      width: 320px;
      height: 260px;
    }
    .building {
      position: absolute;
      bottom: 0;
      border-radius: 6px 6px 0 0;
      background: #78979a;
      box-shadow: inset 0 -7px rgba(0,0,0,.08);
    }
    .building::before {
      content: "";
      position: absolute;
      inset: 12px 9px 0;
      background: repeating-linear-gradient(90deg, #d7e5d8 0 8px, transparent 8px 18px);
      opacity: .72;
    }
    .b1 { width: 74px; height: 120px; left: 24px; }
    .b2 { width: 96px; height: 174px; left: 98px; background: #627f83; }
    .b3 { width: 62px; height: 210px; left: 198px; background: #49676b; }
    .b4 { width: 48px; height: 92px; left: 260px; background: #88a7a1; }
    .road {
      position: absolute;
      left: -12px;
      bottom: -36px;
      width: 370px;
      height: 92px;
      background: #526369;
      transform: rotate(-13deg);
      border-radius: 18px;
      box-shadow: 0 -10px 0 rgba(255,255,255,.22);
    }
    .road::after {
      content: "";
      position: absolute;
      top: 44px;
      left: 0;
      right: 0;
      border-top: 5px dashed #eadf9c;
    }
    @media (max-width: 800px) {
      .scene { padding: 48px 36px 180px; }
      .city { right: 4px; bottom: 6px; transform: scale(.78); transform-origin: bottom right; opacity: .78; }
    }
  </style>
</head>
<body>
  <main class="scene">
    <div class="sun"></div>
    <div class="grid"></div>
    <div class="content">
      <span class="eyebrow">City builder • Early days</span>
      <h1>w317d05</h1>
      <p class="tagline">A tiny city is waiting for someone to give it a street, a skyline, and a reason to exist.</p>
      <div class="status"><span class="dot"></span> Development build is online</div>
    </div>
    <div class="city" aria-hidden="true">
      <div class="building b1"></div>
      <div class="building b2"></div>
      <div class="building b3"></div>
      <div class="building b4"></div>
      <div class="road"></div>
    </div>
  </main>
</body>
</html>`;

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(port, () => {
  console.log(`w317d05 listening on port ${port}`);
});
