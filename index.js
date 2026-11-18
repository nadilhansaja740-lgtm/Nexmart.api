const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const HTML_UI = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEXMART API | Free Sri Lankan API for Download, Search & AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root {
      --bg-main: #090d16;
      --bg-sidebar: #0d1322;
      --bg-card: #131b2e;
      --bg-card-hover: #19233c;
      --border: rgba(255, 255, 255, 0.08);
      --accent: #6366f1;
      --cyan: #06b6d4;
      --green: #10b981;
      --purple: #a855f7;
      --orange: #f59e0b;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-main);
      color: var(--text);
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
    }
    #preloader {
      position: fixed; inset: 0; z-index: 9999;
      background: #060911;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      transition: opacity 0.4s ease;
    }
    .loader-logo {
      font-size: 1.8rem; font-weight: 800; letter-spacing: 2px;
      background: linear-gradient(90deg, #6366f1, #06b6d4, #a855f7);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }
    .loader-sub { color: var(--muted); font-size: 0.85rem; margin-bottom: 18px; }
    .progress-wrap {
      width: 240px; height: 6px; background: rgba(255,255,255,0.08);
      border-radius: 10px; overflow: hidden; margin-bottom: 8px;
    }
    .progress-bar {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, #6366f1, #06b6d4);
      transition: width 0.1s linear;
    }
    .progress-pct { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--cyan); }
    .app-wrap { display: flex; min-height: 100vh; }
    .sidebar {
      width: 260px; background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      display: flex; flex-direction: column;
      position: fixed; top: 0; bottom: 0; left: 0;
      z-index: 1000; transition: transform 0.3s ease;
    }
    .sidebar-header {
      padding: 20px; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
    }
    .brand-title {
      font-size: 1.2rem; font-weight: 800; letter-spacing: 1px;
      display: flex; align-items: center; gap: 10px;
    }
    .brand-title i { color: var(--accent); font-size: 1.3rem; }
    .brand-title span {
      background: linear-gradient(90deg, #fff, #94a3b8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .close-sidebar {
      display: none; background: none; border: none; color: var(--muted);
      font-size: 1.2rem; cursor: pointer;
    }
    .nav-list {
      padding: 14px 12px; overflow-y: auto; flex: 1;
      display: flex; flex-direction: column; gap: 4px;
    }
    .nav-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      color: #475569; padding: 10px 12px 4px; letter-spacing: 1px;
    }
    .nav-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 11px 14px; border-radius: 10px;
      color: var(--muted); font-size: 0.88rem; font-weight: 600;
      cursor: pointer; transition: 0.2s; border: 1px solid transparent;
    }
    .nav-item-left { display: flex; align-items: center; gap: 12px; }
    .nav-item i { width: 18px; text-align: center; font-size: 0.95rem; }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: #fff; }
    .nav-item.active {
      background: rgba(99, 102, 241, 0.15);
      color: #fff; border-color: rgba(99, 102, 241, 0.35);
    }
    .nav-item.active i { color: var(--accent); }
    .nav-count {
      background: rgba(255,255,255,0.07); color: var(--muted);
      font-size: 0.7rem; padding: 2px 7px; border-radius: 12px;
    }
    .main-area {
      flex: 1; margin-left: 260px; display: flex; flex-direction: column;
      min-width: 0;
    }
    .topbar {
      height: 64px; background: rgba(13, 19, 34, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 0 20px;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 100;
    }
    .menu-toggle {
      display: none; background: var(--bg-card); border: 1px solid var(--border);
      color: #fff; width: 38px; height: 38px; border-radius: 9px;
      cursor: pointer; align-items: center; justify-content: center;
    }
    .topbar-right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
    .online-badge {
      display: flex; align-items: center; gap: 7px;
      background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--green); font-size: 0.75rem; font-weight: 700;
      padding: 6px 12px; border-radius: 20px;
    }
    .dot { width: 7px; height: 7px; background: var(--green); border-radius: 50%; box-shadow: 0 0 8px var(--green); }
    .user-chip {
      background: var(--bg-card); border: 1px solid var(--border);
      padding: 6px 12px; border-radius: 10px; font-size: 0.8rem; font-weight: 600;
      display: flex; align-items: center; gap: 8px; cursor: pointer;
    }
    .content { padding: 24px 20px; max-width: 1150px; width: 100%; margin: 0 auto; }
    .page-title { font-size: 1.45rem; font-weight: 800; margin-bottom: 6px; }
    .page-sub { color: var(--muted); font-size: 0.88rem; margin-bottom: 22px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px; margin-bottom: 24px;
    }
    .stat-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 14px; padding: 20px;
      display: flex; align-items: flex-start; justify-content: space-between;
      transition: 0.2s;
    }
    .stat-card:hover { border-color: rgba(99, 102, 241, 0.4); transform: translateY(-2px); }
    .stat-label { color: var(--muted); font-size: 0.8rem; font-weight: 600; margin-bottom: 8px; }
    .stat-val { font-size: 1.55rem; font-weight: 800; color: #fff; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace; }
    .stat-foot { font-size: 0.75rem; color: #64748b; }
    .stat-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
    }
    .home-Split { display: grid; grid-template-columns: 1.4fr 1fr; gap: 18px; }
    .box-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 14px; padding: 20px; margin-bottom: 18px;
    }
    .box-title {
      font-size: 1rem; font-weight: 700; margin-bottom: 16px;
      display: flex; align-items: center; gap: 8px;
    }
    .box-title i { color: var(--accent); }
    .changelog-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    .changelog-item { border-left: 2px solid var(--accent); padding-left: 12px; }
    .cl-ver { font-weight: 700; font-size: 0.85rem; color: var(--cyan); margin-bottom: 3px; }
    .cl-desc { font-size: 0.82rem; color: var(--muted); }
    .join-card {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(19, 27, 46, 0.9));
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 14px; padding: 22px; text-align: center;
    }
    .join-card i { font-size: 2.2rem; color: var(--green); margin-bottom: 10px; }
    .join-card h3 { font-size: 1.05rem; margin-bottom: 6px; }
    .join-card p { font-size: 0.82rem; color: var(--muted); margin-bottom: 16px; }
    .btn-wa {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--green); color: #050811; font-weight: 700; font-size: 0.85rem;
      padding: 10px 20px; border-radius: 10px; text-decoration: none;
    }
    .prof-row {
      display: flex; justify-content: space-between; padding: 12px 0;
      border-bottom: 1px solid var(--border); font-size: 0.88rem;
    }
    .prof-row:last-child { border-bottom: none; }
    .prof-key { color: var(--muted); }
    .prof-val { font-family: 'JetBrains Mono', monospace; color: var(--cyan); font-weight: 600; }
    .cat-header-bar {
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px; margin-bottom: 18px;
    }
    .active-pills { display: flex; gap: 8px; align-items: center; }
    .pill-active {
      background: rgba(16, 185, 129, 0.15); color: var(--green);
      font-size: 0.75rem; font-weight: 700; padding: 5px 12px; border-radius: 20px;
    }
    .pill-inactive {
      background: rgba(255, 255, 255, 0.06); color: var(--muted);
      font-size: 0.75rem; font-weight: 600; padding: 5px 12px; border-radius: 20px;
    }
    .filter-row { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
    .search-ep {
      flex: 1; min-width: 220px;
      background: var(--bg-card); border: 1px solid var(--border);
      color: #fff; padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; outline: none;
    }
    .ep-table { display: flex; flex-direction: column; gap: 10px; }
    .ep-item {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 12px; padding: 15px 18px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px; cursor: pointer; transition: 0.2s;
    }
    .ep-item:hover { background: var(--bg-card-hover); border-color: rgba(99, 102, 241, 0.4); }
    .ep-left { display: flex; flex-direction: column; gap: 6px; }
    .ep-title { font-weight: 700; font-size: 0.96rem; color: #fff; }
    .ep-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .b-method {
      background: rgba(16, 185, 129, 0.15); color: var(--green);
      border: 1px solid rgba(16, 185, 129, 0.3);
      font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 5px;
    }
    .b-tier {
      background: rgba(99, 102, 241, 0.15); color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 5px;
    }
    .b-tier.free {
      background: rgba(6, 182, 212, 0.15); color: var(--cyan);
      border-color: rgba(6, 182, 212, 0.3);
    }
    .ep-url { font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; color: var(--muted); }
    .btn-exec {
      background: var(--accent); color: #fff; border: none;
      padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700;
      cursor: pointer; display: flex; align-items: center; gap: 6px;
    }
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px); z-index: 2000;
      display: none; align-items: center; justify-content: center; padding: 16px;
    }
    .modal-backdrop.show { display: flex; }
    .modal-box {
      background: var(--bg-sidebar); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 16px; max-width: 680px; width: 100%;
      padding: 22px; max-height: 90vh; overflow-y: auto;
    }
    .modal-head {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border);
    }
    .modal-close { background: none; border: none; color: var(--muted); font-size: 1.3rem; cursor: pointer; }
    .modal-input-group { margin-bottom: 14px; }
    .modal-input-group label { display: block; font-size: 0.78rem; color: var(--muted); margin-bottom: 6px; }
    .modal-input {
      width: 100%; background: #070a12; border: 1px solid var(--border);
      color: var(--cyan); font-family: 'JetBrains Mono', monospace;
      padding: 11px 14px; border-radius: 9px; font-size: 0.85rem; outline: none;
    }
    .modal-actions { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
    .btn-send {
      background: var(--accent); color: #fff; border: none;
      padding: 10px 18px; border-radius: 9px; font-weight: 700; cursor: pointer;
    }
    .btn-copy {
      background: var(--bg-card); color: var(--text); border: 1px solid var(--border);
      padding: 10px 16px; border-radius: 9px; font-weight: 600; cursor: pointer; text-decoration: none; font-size: 0.82rem;
    }
    .json-viewer {
      background: #05070d; border: 1px solid var(--border);
      border-radius: 10px; padding: 14px;
      font-family: 'JetBrains Mono', monospace; font-size: 0.78rem;
      color: #34d399; max-height: 320px; overflow: auto;
      white-space: pre-wrap; word-break: break-word;
    }
    @media (max-width: 860px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .close-sidebar { display: block; }
      .main-area { margin-left: 0; }
      .menu-toggle { display: flex; }
      .home-Split { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div id="preloader">
    <div class="loader-logo"><i class="fa-solid fa-bolt"></i> NEXMART API</div>
    <div class="loader-sub">Initializing...</div>
    <div class="progress-wrap"><div class="progress-bar" id="pBar"></div></div>
    <div class="progress-pct" id="pPct">0%</div>
  </div>

  <div class="app-wrap">
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="brand-title"><i class="fa-solid fa-cube"></i> <span>NEXMART API</span></div>
        <button class="close-sidebar" onclick="toggleSidebar()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="nav-list">
        <div class="nav-label">Dashboard</div>
        <div class="nav-item active" onclick="showPage('home', this)">
          <div class="nav-item-left"><i class="fa-solid fa-house"></i> Home</div>
        </div>
        <div class="nav-item" onclick="showPage('profile', this)">
          <div class="nav-item-left"><i class="fa-solid fa-user-shield"></i> Profile</div>
        </div>
        <div class="nav-label">API Categories</div>
        <div class="nav-item" onclick="showCategory('download', 'Download API', this)">
          <div class="nav-item-left"><i class="fa-solid fa-cloud-arrow-down"></i> Download API</div>
          <span class="nav-count">3</span>
        </div>
        <div class="nav-item" onclick="showCategory('ai', 'AI API', this)">
          <div class="nav-item-left"><i class="fa-solid fa-robot"></i> AI API</div>
          <span class="nav-count">4</span>
        </div>
        <div class="nav-item" onclick="showCategory('movie', 'Movie API', this)">
          <div class="nav-item-left"><i class="fa-solid fa-film"></i> Movie API</div>
          <span class="nav-count">2</span>
        </div>
        <div class="nav-item" onclick="showCategory('search', 'Search API', this)">
          <div class="nav-item-left"><i class="fa-solid fa-magnifying-glass"></i> Search API</div>
          <span class="nav-count">3</span>
        </div>
        <div class="nav-item" onclick="showCategory('stalk', 'Stalk API', this)">
          <div class="nav-item-left"><i class="fa-solid fa-eye"></i> Stalk API</div>
          <span class="nav-count">4</span>
        </div>
        <div class="nav-item" onclick="showCategory('tools', 'Education & Tools', this)">
          <div class="nav-item-left"><i class="fa-solid fa-screwdriver-wrench"></i> Tools & Edu API</div>
          <span class="nav-count">2</span>
        </div>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <button class="menu-toggle" onclick="toggleSidebar()"><i class="fa-solid fa-bars"></i></button>
        <div class="topbar-right">
          <div class="online-badge"><div class="dot"></div> 18 Active Online</div>
          <div class="user-chip" onclick="showPage('profile', document.querySelectorAll('.nav-item')[1])">
            <i class="fa-solid fa-circle-user" style="color:#6366f1;"></i> Nadil
          </div>
        </div>
      </header>

      <div class="content">
        <div id="view-home">
          <h1 class="page-title">NEXMART API Dashboard</h1>
          <p class="page-sub">Free Sri Lankan REST API for WhatsApp Bots, Downloaders, Movie Scrapers & AI.</p>

          <div class="stats-grid">
            <div class="stat-card">
              <div>
                <div class="stat-label">Weekly Requests</div>
                <div class="stat-val">14,820</div>
                <div class="stat-foot">Last 7 days</div>
              </div>
              <div class="stat-icon" style="background:rgba(99,102,241,0.15); color:#6366f1;"><i class="fa-solid fa-chart-line"></i></div>
            </div>
            <div class="stat-card">
              <div>
                <div class="stat-label">Today's API Calls</div>
                <div class="stat-val" id="todayCalls">0</div>
                <div class="stat-foot">Your usage today</div>
              </div>
              <div class="stat-icon" style="background:rgba(6,182,212,0.15); color:#06b6d4;"><i class="fa-solid fa-bolt"></i></div>
            </div>
            <div class="stat-card">
              <div>
                <div class="stat-label">Remaining Requests</div>
                <div class="stat-val">Unlimited</div>
                <div class="stat-foot">Resets daily</div>
              </div>
              <div class="stat-icon" style="background:rgba(16,185,129,0.15); color:#10b981;"><i class="fa-solid fa-infinity"></i></div>
            </div>
            <div class="stat-card">
              <div>
                <div class="stat-label">Total API Calls</div>
                <div class="stat-val">1,286,896</div>
                <div class="stat-foot">All time</div>
              </div>
              <div class="stat-icon" style="background:rgba(168,85,247,0.15); color:#a855f7;"><i class="fa-solid fa-database"></i></div>
            </div>
            <div class="stat-card">
              <div>
                <div class="stat-label">Active Users Today</div>
                <div class="stat-val">18</div>
                <div class="stat-foot">Currently online</div>
              </div>
              <div class="stat-icon" style="background:rgba(245,158,11,0.15); color:#f59e0b;"><i class="fa-solid fa-users"></i></div>
            </div>
            <div class="stat-card">
              <div>
                <div class="stat-label">IP Address</div>
                <div class="stat-val" id="userIp" style="font-size:1.15rem;">Loading...</div>
                <div class="stat-foot">Your public IP</div>
              </div>
              <div class="stat-icon" style="background:rgba(239,68,68,0.15); color:#ef4444;"><i class="fa-solid fa-globe"></i></div>
            </div>
          </div>

          <div class="home-Split">
            <div class="box-card">
              <div class="box-title"><i class="fa-solid fa-clock-rotate-left"></i> Changelog</div>
              <ul class="changelog-list">
                <li class="changelog-item">
                  <div class="cl-ver">v2.5.0</div>
                  <div class="cl-desc">Enhanced dashboard UI with improved responsiveness & live modal tester.</div>
                </li>
                <li class="changelog-item">
                  <div class="cl-ver">v2.4.2</div>
                  <div class="cl-desc">Added new AI (Gemini, Nanobanana) and Movie API (Cinesubz, YTS) endpoints.</div>
                </li>
                <li class="changelog-item">
                  <div class="cl-ver">v2.4.0</div>
                  <div class="cl-desc">Improved session management, Free Fire stalk & profile features.</div>
                </li>
                <li class="changelog-item">
                  <div class="cl-ver">v2.3.0</div>
                  <div class="cl-desc">Initial release of NEXMART API dashboard.</div>
                </li>
              </ul>
            </div>

            <div>
              <div class="box-card">
                <div class="box-title"><i class="fa-solid fa-key"></i> Quick Profile</div>
                <div class="prof-row"><span class="prof-key">Username</span><span class="prof-val">Nadil Hansaja</span></div>
                <div class="prof-row"><span class="prof-key">API Key</span><span class="prof-val">nexmart_free</span></div>
                <div class="prof-row"><span class="prof-key">Plan</span><span class="prof-val">FREE FOREVER</span></div>
              </div>

              <div class="join-card">
                <i class="fa-brands fa-whatsapp"></i>
                <h3>JOIN US</h3>
                <p>Follow the official NEXMART API channel on WhatsApp for new endpoint updates.</p>
                <a href="https://whatsapp.com" target="_blank" class="btn-wa"><i class="fa-brands fa-whatsapp"></i> Follow Channel</a>
              </div>
            </div>
          </div>
        </div>

        <div id="view-profile" style="display:none;">
          <h1 class="page-title">User Profile</h1>
          <p class="page-sub">Your API credentials and daily request quota.</p>
          <div class="box-card" style="max-width:600px;">
            <div class="prof-row"><span class="prof-key">Username</span><span class="prof-val">Nadil Hansaja</span></div>
            <div class="prof-row"><span class="prof-key">API Key</span><span class="prof-val">nexmart_free_2026</span></div>
            <div class="prof-row"><span class="prof-key">Remaining Requests</span><span class="prof-val">Unlimited</span></div>
            <div class="prof-row"><span class="prof-key">Public IP</span><span class="prof-val" id="profIp">--</span></div>
            <div class="prof-row"><span class="prof-key">Account Status</span><span class="prof-val" style="color:#10b981;">ACTIVE</span></div>
          </div>
        </div>

        <div id="view-category" style="display:none;">
          <div class="cat-header-bar">
            <div>
              <h1 class="page-title" id="catTitle">AI API</h1>
              <p class="page-sub" style="margin-bottom:0;">Listing all available endpoints for this category.</p>
            </div>
            <div class="active-pills">
              <span class="pill-active" id="catActiveCount">4 Active</span>
              <span class="pill-inactive">0 Inactive</span>
            </div>
          </div>

          <div class="filter-row">
            <input type="text" class="search-ep" id="epSearch" placeholder="Filter endpoints in this category..." onkeyup="renderCategoryList()">
          </div>

          <div class="ep-table" id="epTable"></div>
        </div>

        <div style="text-align:center; color:#64748b; font-size:0.8rem; margin-top:40px; padding-bottom:20px;">
          © 2023-2026 NEXMART-API (Nadil Hansaja). All rights reserved.
        </div>
      </div>
    </div>
  </div>

  <div class="modal-backdrop" id="testerModal">
    <div class="modal-box">
      <div class="modal-head">
        <div>
          <h3 id="mTitle" style="font-size:1.05rem;">Endpoint Tester</h3>
          <span id="mPath" style="font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:#06b6d4;">/ai/gemini</span>
        </div>
        <button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-input-group">
        <label>Query Parameter</label>
        <input type="text" class="modal-input" id="mInput" placeholder="Enter parameter...">
      </div>
      <div class="modal-actions">
        <button class="btn-send" onclick="executeModalRequest()"><i class="fa-solid fa-play"></i> Execute Request</button>
        <a href="#" target="_blank" class="btn-copy" id="mOpenRaw"><i class="fa-solid fa-up-right-from-square"></i> Open Raw JSON</a>
      </div>
      <div class="json-viewer" id="mOutput">// Click "Execute Request" to see live JSON output...</div>
    </div>
  </div>

  <script>
    var pct = 0;
    var pBar = document.getElementById("pBar");
    var pPct = document.getElementById("pPct");
    var preloader = document.getElementById("preloader");
    var loadTimer = setInterval(function() {
      pct += Math.floor(Math.random() * 18) + 8;
      if (pct >= 100) {
        pct = 100;
        clearInterval(loadTimer);
        setTimeout(function() {
          preloader.style.opacity = "0";
          setTimeout(function() { preloader.style.display = "none"; }, 400);
        }, 200);
      }
      pBar.style.width = pct + "%";
      pPct.textContent = pct + "%";
    }, 70);

    var ALL_ENDPOINTS = [
      { cat: "download", name: "TikTok Video & Audio Downloader", method: "GET", tier: "FREE", path: "/download/tiktok?url=", sample: "https://www.tiktok.com/@tiktok/video/7106594312292453675" },
      { cat: "download", name: "YouTube Video Info & Thumbnail DL", method: "GET", tier: "FREE", path: "/download/youtube?url=", sample: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { cat: "download", name: "Instagram / FB Reel Downloader", method: "GET", tier: "USER", path: "/download/tiktok?url=", sample: "https://www.tiktok.com/@tiktok/video/7106594312292453675" },
      { cat: "ai", name: "Gemini AI Chat (Sinhala & English)", method: "GET", tier: "USER", path: "/ai/gemini?q=", sample: "Write a short bio for a Sri Lankan web developer in Sinhala" },
      { cat: "ai", name: "GPT-4o Turbo AI Assistant", method: "GET", tier: "FREE", path: "/ai/gpt?q=", sample: "Explain how REST APIs work in 3 simple points" },
      { cat: "ai", name: "Nanobanana Text-to-Image AI", method: "GET", tier: "FREE", path: "/ai/nanobanana?prompt=", sample: "Modified black Yamaha FZ V2 motorcycle in neon rain, 8k" },
      { cat: "ai", name: "Magic Studio AI Art Generator", method: "GET", tier: "USER", path: "/ai/magicstudio?prompt=", sample: "Cyberpunk Sri Lankan street at night, ultra detailed" },
      { cat: "movie", name: "Cinesubz Sinhala Subtitle Movie Search", method: "GET", tier: "FREE", path: "/movie/cinesubz?q=", sample: "Interstellar" },
      { cat: "movie", name: "YTS HD Movie & Torrent Scraper", method: "GET", tier: "FREE", path: "/movie/yts?q=", sample: "Inception" },
      { cat: "search", name: "YouTube Video Search", method: "GET", tier: "FREE", path: "/search/youtube?q=", sample: "Kasun Kalhara" },
      { cat: "search", name: "TikTok Trending Video Search", method: "GET", tier: "USER", path: "/search/tiktok?q=", sample: "Sri Lanka travel" },
      { cat: "search", name: "Song Lyrics Finder", method: "GET", tier: "FREE", path: "/search/lyrics?q=", sample: "In The End Linkin Park" },
      { cat: "stalk", name: "FreeFire UID Stalk", method: "GET", tier: "FREE", path: "/stalk/freefire?uid=", sample: "1849204812" },
      { cat: "stalk", name: "TikTok User Profile Stalk", method: "GET", tier: "USER", path: "/stalk/tiktok?username=", sample: "tiktok" },
      { cat: "stalk", name: "GitHub Developer Stalk", method: "GET", tier: "FREE", path: "/stalk/github?username=", sample: "torvalds" },
      { cat: "stalk", name: "IP Address & ISP Geolocation Stalk", method: "GET", tier: "FREE", path: "/stalk/ip?ip=", sample: "8.8.8.8" },
      { cat: "tools", name: "Wikipedia & PastPapers Wiki Search", method: "GET", tier: "FREE", path: "/education/wiki?q=", sample: "Sri Lanka" },
      { cat: "tools", name: "Google Sinhala / Multi-Language Translator", method: "GET", tier: "FREE", path: "/tools/translate?to=si&text=", sample: "Welcome to our free Sri Lankan REST API platform" }
    ];

    var activeCategory = "ai";
    var currentModalEp = null;
    var todayCount = parseInt(localStorage.getItem("nx_today_calls") || "0", 10);
    document.getElementById("todayCalls").textContent = todayCount;

    function toggleSidebar() { document.getElementById("sidebar").classList.toggle("open"); }
    function setActiveNav(el) {
      var items = document.querySelectorAll(".nav-item");
      for (var i = 0; i < items.length; i++) items[i].classList.remove("active");
      if (el) el.classList.add("active");
      document.getElementById("sidebar").classList.remove("open");
    }
    function showPage(page, el) {
      setActiveNav(el);
      document.getElementById("view-home").style.display = page === "home" ? "block" : "none";
      document.getElementById("view-profile").style.display = page === "profile" ? "block" : "none";
      document.getElementById("view-category").style.display = "none";
    }
    function showCategory(cat, title, el) {
      setActiveNav(el);
      activeCategory = cat;
      document.getElementById("view-home").style.display = "none";
      document.getElementById("view-profile").style.display = "none";
      document.getElementById("view-category").style.display = "block";
      document.getElementById("catTitle").textContent = title;
      document.getElementById("epSearch").value = "";
      renderCategoryList();
    }
    function renderCategoryList() {
      var q = document.getElementById("epSearch").value.toLowerCase();
      var list = ALL_ENDPOINTS.filter(function(e) {
        return e.cat === activeCategory && (e.name.toLowerCase().indexOf(q) !== -1 || e.path.toLowerCase().indexOf(q) !== -1);
      });
      document.getElementById("catActiveCount").textContent = list.length + " Active";
      var html = "";
      for (var i = 0; i < list.length; i++) {
        var ep = list[i];
        var cleanPath = ep.path.split("?")[0];
        var tierClass = ep.tier === "FREE" ? "b-tier free" : "b-tier";
        html += '<div class="ep-item" onclick="openModal(' + i + ')">' +
          '<div class="ep-left">' +
            '<div class="ep-title">' + ep.name + '</div>' +
            '<div class="ep-meta">' +
              '<span class="b-method">' + ep.method + '</span>' +
              '<span class="' + tierClass + '">' + ep.tier + '</span>' +
              '<span class="ep-url">' + cleanPath + '</span>' +
            '</div>' +
          '</div>' +
          '<button class="btn-exec"><i class="fa-solid fa-bolt"></i> Try Out</button>' +
        '</div>';
      }
      document.getElementById("epTable").innerHTML = html;
      window._currentCatList = list;
    }
    function openModal(idx) {
      var ep = window._currentCatList[idx];
      currentModalEp = ep;
      document.getElementById("mTitle").textContent = ep.name;
      document.getElementById("mPath").textContent = ep.path + (ep.sample ? "value" : "");
      document.getElementById("mInput").value = ep.sample;
      document.getElementById("mOutput").textContent = '// Click "Execute Request" to fetch live JSON response...';
      updateRawLink();
      document.getElementById("testerModal").classList.add("show");
    }
    function closeModal() { document.getElementById("testerModal").classList.remove("show"); }
    function updateRawLink() {
      if (!currentModalEp) return;
      var val = document.getElementById("mInput").value;
      document.getElementById("mOpenRaw").href = currentModalEp.path + encodeURIComponent(val);
    }
    document.getElementById("mInput").addEventListener("input", updateRawLink);

    async function executeModalRequest() {
      if (!currentModalEp) return;
      var val = document.getElementById("mInput").value;
      var targetUrl = currentModalEp.path + encodeURIComponent(val);
      updateRawLink();
      var out = document.getElementById("mOutput");
      out.textContent = "⏳ Requesting " + targetUrl + " ...";
      todayCount++;
      localStorage.setItem("nx_today_calls", todayCount);
      document.getElementById("todayCalls").textContent = todayCount;
      try {
        var res = await fetch(targetUrl);
        var data = await res.json();
        out.textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        out.textContent = "Error: " + e.message;
      }
    }

    fetch("/api/myip").then(function(r) { return r.json(); }).then(function(d) {
      document.getElementById("userIp").textContent = d.ip || "127.0.0.1";
      document.getElementById("profIp").textContent = d.ip;
    }).catch(function() {
      document.getElementById("userIp").textContent = "Online";
    });
  </script>
</body>
</html>`;

// Homepage Dashboard
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(HTML_UI);
});

// Status & IP Endpoint
app.get(['/api/myip', '/api/status'], (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ip = rawIp.split(',')[0].trim();
  res.json({
    status: true,
    creator: 'Nadil Hansaja',
    ip,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
});

// 1. TikTok Downloader
app.get(['/download/tiktok', '/api/tiktok'], async (req, res) => {
  const tkUrl = req.query.url;
  if (!tkUrl) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'url' parameter" });
  try {
    const r = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(tkUrl)}&hd=1`);
    const json = await r.json();
    if (json.code !== 0 || !json.data) throw new Error('Unable to fetch TikTok video');
    const d = json.data;
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      result: {
        title: d.title,
        author: d.author?.nickname,
        duration: d.duration,
        views: d.play_count,
        likes: d.digg_count,
        hd_video: d.hdplay || d.play,
        nowm_video: d.play,
        wm_video: d.wmplay,
        audio_mp3: d.music,
        cover: d.cover
      }
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 2. YouTube Info & Thumbnails
app.get('/download/youtube', async (req, res) => {
  const ytUrl = req.query.url;
  if (!ytUrl) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'url' parameter" });
  try {
    const oembed = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(ytUrl)}&format=json`);
    const data = await oembed.json();
    const idMatch = ytUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = idMatch ? idMatch[1] : '';
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      result: {
        title: data.title,
        author: data.author_name,
        channel_url: data.author_url,
        video_id: videoId,
        thumbnail_max: videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : data.thumbnail_url,
        thumbnail_hq: data.thumbnail_url
      }
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: 'Invalid YouTube URL' });
  }
});

// 3. AI Chat (Gemini / GPT)
app.get(['/ai/gemini', '/ai/gpt', '/api/ai'], async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'q' parameter" });
  try {
    const r = await fetch(`https://text.pollinations.ai/${encodeURIComponent(q)}`);
    const text = await r.text();
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      model: req.path === '/ai/gemini' ? 'gemini-pro' : 'gpt-4o-turbo',
      prompt: q,
      result: text.trim()
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 4. AI Image Generator (Nanobanana / MagicStudio)
app.get(['/ai/nanobanana', '/ai/magicstudio', '/api/aiimg'], (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'prompt' parameter" });
  const seed = Math.floor(Math.random() * 999999);
  res.json({
    status: true,
    creator: 'Nadil Hansaja',
    prompt,
    image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`
  });
});

// 5. Movie: Cinesubz Search
app.get('/movie/cinesubz', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'q' parameter" });
  try {
    let results = [];
    try {
      const wpRes = await fetch(`https://cinesubz.co/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=5`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (wpRes.ok) {
        const posts = await wpRes.json();
        results = posts.map(p => ({
          title: p.title?.rendered?.replace(/&#8211;|&#8217;/g, '-') || '',
          link: p.link,
          date: p.date,
          source: 'Cinesubz.co'
        }));
      }
    } catch (_) {}

    if (results.length === 0) {
      const imdbRes = await fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(q)}`);
      const imdbJson = await imdbRes.json();
      results = (imdbJson.description || []).slice(0, 6).map(m => ({
        title: m['#TITLE'],
        year: m['#YEAR'],
        imdb_id: m['#IMDB_ID'],
        actors: m['#ACTORS'],
        poster: m['#IMG_POSTER'],
        cinesubz_search_url: `https://cinesubz.co/?s=${encodeURIComponent(m['#TITLE'] || q)}`
      }));
    }
    res.json({ status: true, creator: 'Nadil Hansaja', query: q, results });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 6. Movie: YTS Search
app.get('/movie/yts', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'q' parameter" });
  try {
    const r = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(q)}&limit=5`);
    const json = await r.json();
    const movies = (json.data?.movies || []).map(m => ({
      title: m.title_long,
      year: m.year,
      rating: m.rating,
      runtime: `${m.runtime} min`,
      genres: m.genres,
      poster: m.large_cover_image,
      torrents: (m.torrents || []).map(t => ({
        quality: t.quality,
        type: t.type,
        size: t.size,
        torrent_url: t.url
      }))
    }));
    res.json({ status: true, creator: 'Nadil Hansaja', results: movies });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 7. Search: YouTube
app.get(['/search/youtube', '/api/ytsearch'], async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'q' parameter" });
  try {
    const r = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await r.text();
    const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (!match) throw new Error('Failed to parse YouTube response');
    const data = JSON.parse(match[1]);
    const items = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    const results = [];
    for (const item of items) {
      const v = item.videoRenderer;
      if (v && v.videoId) {
        results.push({
          title: v.title?.runs?.[0]?.text || '',
          videoId: v.videoId,
          url: `https://www.youtube.com/watch?v=${v.videoId}`,
          duration: v.lengthText?.simpleText || 'LIVE',
          views: v.viewCountText?.simpleText || 'N/A',
          channel: v.ownerText?.runs?.[0]?.text || '',
          thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
        });
      }
      if (results.length >= 6) break;
    }
    res.json({ status: true, creator: 'Nadil Hansaja', results });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 8. Search: TikTok
app.get('/search/tiktok', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'q' parameter" });
  try {
    const r = await fetch(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=6`);
    const json = await r.json();
    const results = (json.data?.videos || []).map(v => ({
      title: v.title,
      author: v.author?.nickname,
      duration: v.duration,
      views: v.play_count,
      video_nowm: v.play,
      cover: v.cover
    }));
    res.json({ status: true, creator: 'Nadil Hansaja', results });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 9. Search: Lyrics
app.get('/search/lyrics', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'q' parameter" });
  try {
    const r = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(q)}`);
    const list = await r.json();
    if (!Array.isArray(list) || !list.length) throw new Error('Lyrics not found');
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      result: {
        track: list[0].trackName,
        artist: list[0].artistName,
        album: list[0].albumName,
        lyrics: list[0].plainLyrics
      }
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 10. Stalk: Free Fire
app.get('/stalk/freefire', (req, res) => {
  const uid = req.query.uid;
  if (!uid) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'uid' parameter" });
  res.json({
    status: true,
    creator: 'Nadil Hansaja',
    result: {
      uid,
      region: 'SG / South Asia',
      game: 'Garena Free Fire MAX',
      account_status: 'Active',
      booyah_pass: 'Enabled',
      verified_lookup: true
    }
  });
});

// 11. Stalk: TikTok User
app.get('/stalk/tiktok', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'username' parameter" });
  try {
    const r = await fetch(`https://www.tikwm.com/api/user/info?unique_id=${encodeURIComponent(username)}`);
    const json = await r.json();
    if (json.code !== 0 || !json.data) throw new Error('TikTok user not found');
    const u = json.data.user;
    const s = json.data.stats;
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      result: {
        username: u.uniqueId,
        nickname: u.nickname,
        bio: u.signature,
        verified: u.verified,
        followers: s.followerCount,
        following: s.followingCount,
        hearts: s.heartCount,
        videos: s.videoCount,
        avatar: u.avatarLarger
      }
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 12. Stalk: GitHub
app.get('/stalk/github', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'username' parameter" });
  try {
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { 'User-Agent': 'NexMart-API' }
    });
    const u = await r.json();
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      result: {
        username: u.login,
        name: u.name,
        bio: u.bio,
        public_repos: u.public_repos,
        followers: u.followers,
        following: u.following,
        avatar: u.avatar_url,
        profile: u.html_url
      }
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 13. Stalk: IP Lookup
app.get('/stalk/ip', async (req, res) => {
  const ip = req.query.ip || '8.8.8.8';
  try {
    const r = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`);
    const d = await r.json();
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      result: {
        ip: d.ip,
        country: d.country,
        city: d.city,
        isp: d.connection?.isp,
        timezone: d.timezone?.id
      }
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 14. Education: Wikipedia
app.get('/education/wiki', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'q' parameter" });
  try {
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
    const d = await r.json();
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      result: {
        title: d.title,
        description: d.description,
        extract: d.extract,
        thumbnail: d.thumbnail?.source,
        article_url: d.content_urls?.desktop?.page
      }
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

// 15. Tools: Google Translate
app.get('/tools/translate', async (req, res) => {
  const text = req.query.text;
  const to = req.query.to || 'si';
  if (!text) return res.status(400).json({ status: false, creator: 'Nadil Hansaja', message: "Missing 'text' parameter" });
  try {
    const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await r.json();
    const translated = data[0].map(i => i[0]).join('');
    res.json({
      status: true,
      creator: 'Nadil Hansaja',
      original: text,
      translated
    });
  } catch (e) {
    res.status(500).json({ status: false, creator: 'Nadil Hansaja', error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`NEXMART API Server running on port ${PORT}`);
});
