import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>w317d05 — City Builder</title>
  <style>
    :root {
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #18232a;
      background: #dff1e5;
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; overflow: hidden; background: linear-gradient(135deg, #cce8d4 0%, #eff7eb 50%, #bddbc5 100%); }
    button, select { font: inherit; }
    .screen { min-height: 100vh; }
    .welcome { display: grid; place-items: center; padding: 28px; }
    .welcome[hidden], .game[hidden] { display: none; }
    .scene {
      position: relative;
      width: min(1100px, 92vw);
      padding: 72px;
      border: 1px solid rgba(24, 35, 42, .1);
      border-radius: 32px;
      background: rgba(255,255,255,.86);
      box-shadow: 0 30px 90px rgba(38, 69, 54, .18);
      backdrop-filter: blur(14px);
      overflow: hidden;
    }
    .sun { position: absolute; width: 220px; height: 220px; top: -90px; right: -60px; border-radius: 50%; background: #f7d77c; opacity: .75; }
    .welcome-grid {
      position: absolute; inset: 0; opacity: .18;
      background-image: linear-gradient(rgba(24,35,42,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(24,35,42,.14) 1px, transparent 1px);
      background-size: 28px 28px;
      transform: perspective(700px) rotateX(58deg) scale(1.45) translateY(35%);
      transform-origin: bottom center;
    }
    .content { position: relative; z-index: 2; max-width: 760px; }
    .eyebrow { display: inline-flex; padding: 7px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; background: #203239; color: #f5f3e9; }
    h1 { margin: 22px 0 12px; font-size: clamp(56px, 9vw, 108px); line-height: .9; letter-spacing: -.06em; }
    .tagline { margin: 0; max-width: 680px; font-size: clamp(20px, 3vw, 30px); line-height: 1.25; color: #3a5358; }
    .start-row { display: flex; flex-wrap: wrap; align-items: end; gap: 14px; margin-top: 34px; }
    .start-card { display: grid; gap: 7px; }
    .start-card label { font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #52676b; }
    select, .start-button {
      min-height: 50px; border: 0; border-radius: 13px; padding: 0 18px;
      box-shadow: 0 10px 25px rgba(38, 69, 54, .12);
    }
    select { min-width: 170px; background: #f6fbf4; color: #18232a; border: 1px solid rgba(24,35,42,.12); }
    .start-button { cursor: pointer; background: #203239; color: #fff; font-weight: 800; padding-inline: 28px; transition: transform .15s ease, box-shadow .15s ease; }
    .start-button:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(38, 69, 54, .2); }
    .status { display: flex; gap: 10px; align-items: center; margin-top: 18px; font-size: 14px; color: #52676b; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: #63a86f; box-shadow: 0 0 0 5px rgba(99,168,111,.14); }
    .city { position: absolute; z-index: 1; right: 52px; bottom: 34px; width: 320px; height: 260px; }
    .building { position: absolute; bottom: 0; border-radius: 6px 6px 0 0; background: #78979a; box-shadow: inset 0 -7px rgba(0,0,0,.08); }
    .building::before { content: ""; position: absolute; inset: 12px 9px 0; background: repeating-linear-gradient(90deg, #d7e5d8 0 8px, transparent 8px 18px); opacity: .72; }
    .b1 { width: 74px; height: 120px; left: 24px; }.b2 { width: 96px; height: 174px; left: 98px; background: #627f83; }.b3 { width: 62px; height: 210px; left: 198px; background: #49676b; }.b4 { width: 48px; height: 92px; left: 260px; background: #88a7a1; }
    .road { position: absolute; left: -12px; bottom: -36px; width: 370px; height: 92px; background: #526369; transform: rotate(-13deg); border-radius: 18px; box-shadow: 0 -10px 0 rgba(255,255,255,.22); }
    .road::after { content: ""; position: absolute; top: 44px; left: 0; right: 0; border-top: 5px dashed #eadf9c; }

    .game { height: 100vh; display: grid; grid-template-rows: 68px 1fr; background: #dbe8d9; }
    .dashboard { z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 0 22px; background: rgba(255,255,255,.94); border-bottom: 1px solid rgba(24,35,42,.12); box-shadow: 0 8px 25px rgba(38,69,54,.1); }
    .brand { display: flex; align-items: center; gap: 12px; font-weight: 900; letter-spacing: -.02em; }
    .brand-mark { width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; background: #203239; color: white; font-size: 13px; }
    .dashboard-actions { display: flex; align-items: center; gap: 14px; }
    .time { display: flex; align-items: baseline; gap: 10px; }
    .time-label { color: #6a777a; font-size: 12px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
    .date { font-variant-numeric: tabular-nums; font-size: 24px; font-weight: 900; letter-spacing: -.03em; }
    .zoom-controls { display: flex; align-items: center; gap: 5px; padding: 5px; border-radius: 12px; background: #eef4ec; border: 1px solid rgba(24,35,42,.1); }
    .zoom-button { width: 38px; height: 38px; border: 0; border-radius: 9px; background: white; color: #203239; cursor: pointer; font-size: 24px; line-height: 1; font-weight: 800; display: grid; place-items: center; box-shadow: 0 4px 10px rgba(38,69,54,.08); }
    .zoom-button:active { transform: scale(.96); }
    .zoom-level { min-width: 50px; text-align: center; font-size: 12px; font-weight: 800; color: #52676b; }
    .viewport { min-height: 0; overflow: auto; overscroll-behavior: contain; background: #c7d8c3; touch-action: pan-x pan-y; }
    .world { position: relative; width: 24576px; height: 24576px; background-color: #d5e4cf; background-image: linear-gradient(to right, rgba(81,108,78,.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(81,108,78,.22) 1px, transparent 1px); background-size: 48px 48px; }
    .world::after { content: ""; position: absolute; left: 0; top: 0; width: 24576px; height: 24576px; pointer-events: none; background-image: radial-gradient(circle at center, rgba(255,255,255,.18) 0 1px, transparent 1px); background-size: 48px 48px; }
    .start-marker { position: absolute; left: 12240px; top: 12240px; width: 48px; height: 48px; border: 2px solid rgba(32,50,57,.25); border-radius: 8px; background: rgba(255,255,255,.25); pointer-events: none; }
    .selected-cell { position: absolute; pointer-events: none; width: 48px; height: 48px; border: 3px solid #203239; background: rgba(255,255,255,.16); box-shadow: inset 0 0 0 1px rgba(255,255,255,.55), 0 0 0 1px rgba(255,255,255,.35); display: none; z-index: 4; }
    .hint { position: fixed; left: 18px; bottom: 16px; z-index: 20; padding: 9px 12px; border-radius: 10px; background: rgba(32,50,57,.84); color: white; font-size: 12px; box-shadow: 0 8px 20px rgba(0,0,0,.12); }
    @media (max-width: 800px) {
      .scene { padding: 48px 36px 210px; }
      .city { right: 4px; bottom: 6px; transform: scale(.78); transform-origin: bottom right; opacity: .78; }
      .dashboard { padding: 0 12px; }.dashboard-actions { gap: 8px; }.time-label { display: none; }.date { font-size: 18px; }.brand span:last-child { display: none; }.zoom-level { display: none; }
      .zoom-button { width: 42px; height: 42px; }
      .hint { display: none; }
    }
  </style>
</head>
<body>
  <section class="screen welcome" id="welcomeScreen">
    <main class="scene">
      <div class="sun"></div><div class="welcome-grid"></div>
      <div class="content">
        <span class="eyebrow">City builder • Early days</span>
        <h1>w317d05</h1>
        <p class="tagline">A tiny city is waiting for someone to give it a street, a skyline, and a reason to exist.</p>
        <div class="start-row">
          <div class="start-card">
            <label for="startYear">Start year</label>
            <select id="startYear" aria-label="Start year">
              <option value="1925">1925</option>
              <option value="1975">1975</option>
              <option value="2025" selected>2025</option>
            </select>
          </div>
          <button class="start-button" id="startGame" type="button">Start Game</button>
        </div>
        <div class="status"><span class="dot"></span> Vanilla city simulation • 1 day every 5 seconds</div>
      </div>
      <div class="city" aria-hidden="true"><div class="building b1"></div><div class="building b2"></div><div class="building b3"></div><div class="building b4"></div><div class="road"></div></div>
    </main>
  </section>

  <section class="screen game" id="gameScreen" hidden>
    <header class="dashboard">
      <div class="brand"><span class="brand-mark">w</span><span>w317d05</span></div>
      <div class="dashboard-actions">
        <div class="time"><span class="time-label">City time</span><span class="date" id="gameDate">2025-01-01</span></div>
        <div class="zoom-controls" aria-label="Zoom controls">
          <button class="zoom-button" id="zoomOut" type="button" aria-label="Zoom out" title="Zoom out">−</button>
          <span class="zoom-level" id="zoomLevel">100%</span>
          <button class="zoom-button" id="zoomIn" type="button" aria-label="Zoom in" title="Zoom in">+</button>
        </div>
      </div>
    </header>
    <div class="viewport" id="viewport" tabindex="0" aria-label="City viewport">
      <div class="world" id="world">
        <div class="start-marker" aria-hidden="true"></div>
        <div class="selected-cell" id="selectedCell" aria-hidden="true"></div>
      </div>
    </div>
    <div class="hint">512 × 512 tiles · 48 px each · pinch or use + / − to zoom</div>
  </section>

  <script>
    const TILE_SIZE = 48;
    const GRID_SIZE = 512;
    const DAY_MS = 5000;
    const WORLD_SIZE = GRID_SIZE * TILE_SIZE;
    const START_X = Math.floor(GRID_SIZE / 2) * TILE_SIZE;
    const START_Y = Math.floor(GRID_SIZE / 2) * TILE_SIZE;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 2.5;
    const ZOOM_STEP = 1.2;
    let zoom = 1;
    let simulationTimer = null;
    let pointerState = null;
    let pinchState = null;

    const welcomeScreen = document.getElementById('welcomeScreen');
    const gameScreen = document.getElementById('gameScreen');
    const viewport = document.getElementById('viewport');
    const world = document.getElementById('world');
    const startYear = document.getElementById('startYear');
    const startGame = document.getElementById('startGame');
    const gameDate = document.getElementById('gameDate');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const zoomLevel = document.getElementById('zoomLevel');
    const selectedCell = document.getElementById('selectedCell');

    function formatDate(date) {
      return [date.getUTCFullYear(), String(date.getUTCMonth() + 1).padStart(2, '0'), String(date.getUTCDate()).padStart(2, '0')].join('-');
    }

    function renderZoom() {
      world.style.width = WORLD_SIZE * zoom + 'px';
      world.style.height = WORLD_SIZE * zoom + 'px';
      world.style.backgroundSize = TILE_SIZE * zoom + 'px ' + TILE_SIZE * zoom + 'px';
      const marker = world.querySelector('.start-marker');
      marker.style.left = START_X * zoom + 'px';
      marker.style.top = START_Y * zoom + 'px';
      marker.style.width = TILE_SIZE * zoom + 'px';
      marker.style.height = TILE_SIZE * zoom + 'px';
      selectedCell.style.width = TILE_SIZE * zoom + 'px';
      selectedCell.style.height = TILE_SIZE * zoom + 'px';
      zoomLevel.textContent = Math.round(zoom * 100) + '%';
    }

    function applyZoom(nextZoom, anchorX = viewport.clientWidth / 2, anchorY = viewport.clientHeight / 2) {
      const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
      if (clampedZoom === zoom) return;

      const worldX = (viewport.scrollLeft + anchorX) / zoom;
      const worldY = (viewport.scrollTop + anchorY) / zoom;
      zoom = clampedZoom;
      renderZoom();
      viewport.scrollLeft = worldX * zoom - anchorX;
      viewport.scrollTop = worldY * zoom - anchorY;
    }

    function startSimulation(year) {
      let currentDate = new Date(Date.UTC(Number(year), 0, 1));
      gameDate.textContent = formatDate(currentDate);
      clearInterval(simulationTimer);
      simulationTimer = setInterval(() => {
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        gameDate.textContent = formatDate(currentDate);
      }, DAY_MS);
    }

    function openCity() {
      const year = startYear.value;
      welcomeScreen.hidden = true;
      gameScreen.hidden = false;
      zoom = 1;
      selectedCell.style.display = 'none';
      renderZoom();
      viewport.scrollLeft = START_X - viewport.clientWidth / 2;
      viewport.scrollTop = START_Y - viewport.clientHeight / 2;
      viewport.focus({ preventScroll: true });
      startSimulation(year);
    }

    function selectCell(clientX, clientY) {
      const rect = viewport.getBoundingClientRect();
      const localX = clientX - rect.left + viewport.scrollLeft;
      const localY = clientY - rect.top + viewport.scrollTop;
      const cellX = Math.floor(localX / (TILE_SIZE * zoom));
      const cellY = Math.floor(localY / (TILE_SIZE * zoom));
      if (cellX < 0 || cellY < 0 || cellX >= GRID_SIZE || cellY >= GRID_SIZE) return;
      selectedCell.style.left = cellX * TILE_SIZE * zoom + 'px';
      selectedCell.style.top = cellY * TILE_SIZE * zoom + 'px';
      selectedCell.style.display = 'block';
    }

    zoomIn.addEventListener('click', () => applyZoom(zoom * ZOOM_STEP));
    zoomOut.addEventListener('click', () => applyZoom(zoom / ZOOM_STEP));

    viewport.addEventListener('wheel', (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const anchorX = event.clientX - rect.left;
      const anchorY = event.clientY - rect.top;
      applyZoom(zoom * (event.deltaY < 0 ? 1.1 : 1 / 1.1), anchorX, anchorY);
    }, { passive: false });

    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') {
        if (!pinchState) pinchState = new Map();
        pinchState.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pinchState.size === 2) {
          const points = [...pinchState.values()];
          pinchState.startDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
          pinchState.startZoom = zoom;
        }
        return;
      }
      pointerState = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    });

    viewport.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' && pinchState?.has(event.pointerId)) {
        pinchState.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pinchState.size !== 2 || !pinchState.startDistance) return;
        const points = [...pinchState.values()];
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
        if (!distance) return;
        const rect = viewport.getBoundingClientRect();
        const anchorX = ((points[0].x + points[1].x) / 2) - rect.left;
        const anchorY = ((points[0].y + points[1].y) / 2) - rect.top;
        applyZoom(pinchState.startZoom * (distance / pinchState.startDistance), anchorX, anchorY);
        return;
      }
      if (!pointerState || pointerState.id !== event.pointerId) return;
      if (Math.hypot(event.clientX - pointerState.x, event.clientY - pointerState.y) > 8) pointerState.moved = true;
    });

    viewport.addEventListener('pointerup', (event) => {
      if (event.pointerType === 'touch') {
        if (pinchState?.has(event.pointerId)) pinchState.delete(event.pointerId);
        if (pinchState?.size < 2) { delete pinchState.startDistance; delete pinchState.startZoom; }
        if (pinchState?.size === 0) pinchState = null;
        return;
      }
      if (pointerState?.id !== event.pointerId) return;
      if (!pointerState.moved) selectCell(event.clientX, event.clientY);
      pointerState = null;
    });

    viewport.addEventListener('pointercancel', (event) => {
      if (event.pointerType === 'touch') {
        pinchState?.delete(event.pointerId);
        if (pinchState?.size === 0) pinchState = null;
        return;
      }
      if (pointerState?.id === event.pointerId) pointerState = null;
    });

    viewport.addEventListener('click', (event) => {
      if (event.detail !== 1 || event.pointerType === 'touch') return;
      selectCell(event.clientX, event.clientY);
    });

    startGame.addEventListener('click', openCity);
    renderZoom();
  </script>
</body>
</html>`;

const server = createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(port, () => {
  console.log(`w317d05 listening on port ${port}`);
});
