import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>w317d05 — City Builder</title>
  <style>
    :root { font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #18232a; background: #dff1e5; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; overflow: hidden; background: linear-gradient(135deg, #cce8d4 0%, #eff7eb 50%, #bddbc5 100%); }
    button, select { font: inherit; }
    .screen { min-height: 100vh; }
    .welcome { display: grid; place-items: center; padding: 28px; }
    .welcome[hidden], .game[hidden] { display: none; }
    .scene { position: relative; width: min(1100px, 92vw); padding: 72px; border: 1px solid rgba(24,35,42,.1); border-radius: 32px; background: rgba(255,255,255,.86); box-shadow: 0 30px 90px rgba(38,69,54,.18); backdrop-filter: blur(14px); overflow: hidden; }
    .sun { position: absolute; width: 220px; height: 220px; top: -90px; right: -60px; border-radius: 50%; background: #f7d77c; opacity: .75; }
    .welcome-grid { position: absolute; inset: 0; opacity: .18; background-image: linear-gradient(rgba(24,35,42,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(24,35,42,.14) 1px, transparent 1px); background-size: 28px 28px; transform: perspective(700px) rotateX(58deg) scale(1.45) translateY(35%); transform-origin: bottom center; }
    .content { position: relative; z-index: 2; max-width: 760px; }
    .eyebrow { display: inline-flex; padding: 7px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; background: #203239; color: #f5f3e9; }
    h1 { margin: 22px 0 12px; font-size: clamp(56px, 9vw, 108px); line-height: .9; letter-spacing: -.06em; }
    .tagline { margin: 0; max-width: 680px; font-size: clamp(20px, 3vw, 30px); line-height: 1.25; color: #3a5358; }
    .start-row { display: flex; flex-wrap: wrap; align-items: end; gap: 14px; margin-top: 34px; }
    .start-card { display: grid; gap: 7px; }
    .start-card label { font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #52676b; }
    select, .start-button { min-height: 50px; border: 0; border-radius: 13px; padding: 0 18px; box-shadow: 0 10px 25px rgba(38,69,54,.12); }
    select { min-width: 170px; background: #f6fbf4; color: #18232a; border: 1px solid rgba(24,35,42,.12); }
    .start-button { cursor: pointer; background: #203239; color: #fff; font-weight: 800; padding-inline: 28px; }
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
    .world::after { content: ""; position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(circle at center, rgba(255,255,255,.18) 0 1px, transparent 1px); background-size: 48px 48px; }
    .start-marker, .selected-cell { position: absolute; box-sizing: border-box; pointer-events: none; }
    .start-marker { border: 2px solid rgba(32,50,57,.25); border-radius: 8px; background: rgba(255,255,255,.25); }
    .selected-cell { border: 3px solid #203239; background: rgba(255,255,255,.16); box-shadow: inset 0 0 0 1px rgba(255,255,255,.55), 0 0 0 1px rgba(255,255,255,.35); display: none; z-index: 4; }
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
            <select id="startYear" aria-label="Start year"><option value="1925">1925</option><option value="1975">1975</option><option value="2025" selected>2025</option></select>
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
        <div class="start-marker" id="startMarker" aria-hidden="true"></div>
        <div class="selected-cell" id="selectedCell" aria-hidden="true"></div>
      </div>
    </div>
    <div class="hint">512 × 512 tiles · 48 px each · click or tap to select · pinch or use + / − to zoom</div>
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
    const TAP_TOLERANCE = 8;
    let zoom = 1;
    let simulationTimer = null;
    const pointers = new Map();
    let gesture = null;

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
    const startMarker = document.getElementById('startMarker');
    const selectedCell = document.getElementById('selectedCell');

    function formatDate(date) {
      return [date.getUTCFullYear(), String(date.getUTCMonth() + 1).padStart(2, '0'), String(date.getUTCDate()).padStart(2, '0')].join('-');
    }

    function renderZoom() {
      const tilePixels = TILE_SIZE * zoom;
      world.style.width = WORLD_SIZE * zoom + 'px';
      world.style.height = WORLD_SIZE * zoom + 'px';
      world.style.backgroundSize = tilePixels + 'px ' + tilePixels + 'px';
      startMarker.style.left = START_X * zoom + 'px';
      startMarker.style.top = START_Y * zoom + 'px';
      startMarker.style.width = tilePixels + 'px';
      startMarker.style.height = tilePixels + 'px';
      if (selectedCell.dataset.cellX !== undefined) {
        selectedCell.style.left = Number(selectedCell.dataset.cellX) * tilePixels + 'px';
        selectedCell.style.top = Number(selectedCell.dataset.cellY) * tilePixels + 'px';
        selectedCell.style.width = tilePixels + 'px';
        selectedCell.style.height = tilePixels + 'px';
      }
      zoomLevel.textContent = Math.round(zoom * 100) + '%';
    }

    function applyZoom(nextZoom, anchorX = viewport.clientWidth / 2, anchorY = viewport.clientHeight / 2) {
      const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
      if (next === zoom) return;
      const worldX = (viewport.scrollLeft + anchorX) / zoom;
      const worldY = (viewport.scrollTop + anchorY) / zoom;
      zoom = next;
      renderZoom();
      viewport.scrollLeft = worldX * zoom - anchorX;
      viewport.scrollTop = worldY * zoom - anchorY;
    }

    function selectCell(clientX, clientY) {
      // client coordinates -> viewport coordinates -> world CSS coordinates.
      // Do not use world.getBoundingClientRect().width here: at some zoom levels
      // browsers can report fractional layout dimensions differently from the
      // positioned child, producing a visible offset after scrolling/zooming.
      const viewportRect = viewport.getBoundingClientRect();
      const viewportX = clientX - viewportRect.left;
      const viewportY = clientY - viewportRect.top;
      if (viewportX < 0 || viewportY < 0 || viewportX >= viewport.clientWidth || viewportY >= viewport.clientHeight) return;

      const worldX = viewport.scrollLeft + viewportX;
      const worldY = viewport.scrollTop + viewportY;
      const tilePixels = TILE_SIZE * zoom;
      const cellX = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(worldX / tilePixels)));
      const cellY = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor(worldY / tilePixels)));

      selectedCell.dataset.cellX = String(cellX);
      selectedCell.dataset.cellY = String(cellY);
      selectedCell.style.left = cellX * tilePixels + 'px';
      selectedCell.style.top = cellY * tilePixels + 'px';
      selectedCell.style.width = tilePixels + 'px';
      selectedCell.style.height = tilePixels + 'px';
      selectedCell.style.display = 'block';
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
      delete selectedCell.dataset.cellX;
      delete selectedCell.dataset.cellY;
      selectedCell.style.display = 'none';
      renderZoom();
      viewport.scrollLeft = START_X - viewport.clientWidth / 2;
      viewport.scrollTop = START_Y - viewport.clientHeight / 2;
      viewport.focus({ preventScroll: true });
      startSimulation(year);
    }

    zoomIn.addEventListener('click', () => applyZoom(zoom * ZOOM_STEP));
    zoomOut.addEventListener('click', () => applyZoom(zoom / ZOOM_STEP));

    viewport.addEventListener('wheel', (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      applyZoom(zoom * (event.deltaY < 0 ? 1.1 : 1 / 1.1), event.clientX - rect.left, event.clientY - rect.top);
    }, { passive: false });

    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') {
        gesture = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
        return;
      }

      pointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const midpoint = { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
        const rect = viewport.getBoundingClientRect();
        gesture = {
          type: 'pinch',
          startDistance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          startZoom: zoom,
          anchorX: midpoint.x - rect.left,
          anchorY: midpoint.y - rect.top
        };
      } else {
        gesture = { type: 'touch', pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
      }
    });

    viewport.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'touch') {
        if (gesture?.pointerId === event.pointerId && Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > TAP_TOLERANCE) gesture.moved = true;
        return;
      }

      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });

      if (pointers.size === 2 && gesture?.type === 'pinch') {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (gesture.startDistance > 0) applyZoom(gesture.startZoom * (distance / gesture.startDistance), gesture.anchorX, gesture.anchorY);
        return;
      }

      if (gesture?.type === 'touch' && gesture.pointerId === event.pointerId && Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > TAP_TOLERANCE) gesture.moved = true;
    });

    viewport.addEventListener('pointerup', (event) => {
      if (event.pointerType !== 'touch') {
        if (gesture?.pointerId === event.pointerId) {
          if (!gesture.moved) selectCell(event.clientX, event.clientY);
          gesture = null;
        }
        return;
      }

      const wasPinching = gesture?.type === 'pinch';
      pointers.delete(event.pointerId);

      if (wasPinching || pointers.size > 0) {
        if (pointers.size === 1) {
          const [remainingId, remaining] = pointers.entries().next().value;
          gesture = { type: 'touch', pointerId: remainingId, startX: remaining.clientX, startY: remaining.clientY, moved: true };
        } else if (pointers.size === 0) {
          gesture = null;
        }
        return;
      }

      if (gesture?.type === 'touch' && gesture.pointerId === event.pointerId) {
        if (!gesture.moved) selectCell(event.clientX, event.clientY);
        gesture = null;
      }
    });

    viewport.addEventListener('pointercancel', (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) gesture = null;
      if (gesture?.pointerId === event.pointerId) gesture = null;
    });

    viewport.addEventListener('click', (event) => {
      if (event.detail !== 1 || event.pointerType === 'touch') return;
      selectCell(event.clientX, event.clientY);
    });

    renderZoom();
    startGame.addEventListener('click', openCity);
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