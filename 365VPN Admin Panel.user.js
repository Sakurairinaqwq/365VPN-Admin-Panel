// ==UserScript==
// @name         365VPN Admin Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  抛弃原版那难看的UI!拥抱全新丝滑的控制面板！
// @author       Sakurairinaqwq
// @match        http://192.168.1.1/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const bypassHotlink = () => {
        if (!document.querySelector('meta[name="referrer"]')) {
            const meta = document.createElement('meta');
            meta.name = 'referrer';
            meta.content = 'no-referrer';
            document.head.appendChild(meta);
        }
    };

    const dynamicWallpaperUrl = `https://api.yppp.net/api.php?_t=${Date.now()}`;

    const dynamicDashboardStyles = `
        /* ----------------------------------
           1. 字体引擎重构与全局净化
        ----------------------------------- */
        html, body, #app {
            background: transparent !important;
            background-color: transparent !important;
            /* 注入现代游戏UI常用的字体栈，优先调用高品质系统字体 */
            font-family: "PingFang SC", "HarmonyOS Sans", "MiSans", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif !important;
            -webkit-font-smoothing: antialiased !important; /* 开启字体抗锯齿，边缘更平滑 */
        }

        body::before {
            content: ""; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-image: url("${dynamicWallpaperUrl}") !important;
            background-size: cover !important; background-position: center !important;
            background-repeat: no-repeat !important; z-index: -999 !important;
            animation: slideUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* ----------------------------------
           2. 色彩与多重文本投影
        ----------------------------------- */
        body[arco-theme="dark"] {
            --color-text-1: #FFFFFF !important;
            --color-text-2: #F1F5F9 !important; /* 提高了次要文字的亮度 */
            --color-text-3: #CBD5E1 !important;

            /* 核心：双层投影。第一层做锐利描边保证边缘识别，第二层做环境光遮蔽 */
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9), 0 2px 8px rgba(0, 0, 0, 0.6) !important;
            font-weight: 500 !important; /* 全局加粗字重 */

            --color-bg-1: transparent !important; --color-bg-2: transparent !important; --color-bg-3: transparent !important;
            --color-border-1: rgba(255, 255, 255, 0.15) !important;
            --arcoblue-6: #3B82F6 !important; --color-primary-light-1: rgba(255, 255, 255, 0.15) !important;
        }
        input, button, .arco-btn { text-shadow: none !important; }

        .arco-table, .arco-table-container, .arco-table-content-inner, .arco-table-content-scroll,
        table, tbody, tr, td, th, .arco-spin, .arco-spin-children, .arco-tabs-content, .arco-tabs-pane,
        .c3-card .container, .c3-card .header, .c3-card .body, .c3-card .list, .c3-card .footer {
            background: transparent !important; background-color: transparent !important;
        }

        /* ----------------------------------
           3. 文本劫持与布局
        ----------------------------------- */
        div[style*="font-size: 26px;"] .arco-col-md-8 { position: relative; min-height: 60px; display: flex; align-items: center; }
        div[style*="font-size: 26px;"] .arco-col-md-8 > div { display: none !important; }
        div[style*="font-size: 26px;"] .arco-col-md-8::after {
            content: "欢迎回来！今天也要元气满满喵~";
            display: block; color: var(--color-text-1) !important; font-size: 26px !important;
            font-weight: 700 !important; /* 主标题使用最粗字重 */
            text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.6) !important;
            letter-spacing: 1px;
        }

        div[style*="max-width: 1080px"] { max-width: 1100px !important; margin: 4vh auto !important; padding: 20px !important; }
        .arco-row[style*="margin: -7.5px;"] { display: flex !important; flex-wrap: wrap !important; justify-content: center !important; gap: 24px !important; margin: 0 !important; }

        .arco-col-md-16 {
            flex: 1 1 60% !important; max-width: 650px !important; padding: 0 !important;
            opacity: 0; animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards;
        }

        .arco-col-md-8 { flex: 1 1 35% !important; max-width: 400px !important; padding: 0 !important; display: flex !important; flex-direction: column !important; }
        .arco-col-md-8 > .arco-row { margin: 0 !important; display: flex; flex-direction: column; gap: 16px; }

        .arco-col-md-8 .arco-col-24 { padding: 0 !important; opacity: 0; }
        .arco-col-md-8 .arco-col-24:nth-child(1) { animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s forwards; }
        .arco-col-md-8 .arco-col-24:nth-child(2) { animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s forwards; }
        .arco-col-md-8 .arco-col-24:nth-child(3) { animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s forwards; }
        .arco-col-md-8 .arco-col-24:nth-child(4) { animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.45s forwards; }
        .arco-col-md-8 .arco-col-24:nth-child(5) { animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.55s forwards; }

        .arco-table[style*="height: 500px;"] { height: calc(100vh - 340px) !important; min-height: 400px !important; }

        /* ----------------------------------
           4. 烟熏玻璃材质 (Smoked Glass)
        ----------------------------------- */
        .c3-card {
            /* 核心修改：加强黑色底色比重，保证文字对比度，同时保留环境光折射 */
            background: linear-gradient(135deg, rgba(15, 15, 20, 0.55) 0%, rgba(5, 5, 10, 0.75) 100%) !important;
            backdrop-filter: blur(20px) saturate(150%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important; border-radius: 16px !important;
            overflow: hidden; height: 100%;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, box-shadow 0.3s ease !important;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
        }

        .c3-card:hover {
            transform: translateY(-4px);
            /* 悬浮时稍微提亮，增加交互反馈 */
            background: linear-gradient(135deg, rgba(30, 30, 35, 0.65) 0%, rgba(10, 10, 15, 0.85) 100%) !important;
            box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.7), inset 0 2px 0 rgba(255, 255, 255, 0.2) !important;
        }

        /* ----------------------------------
           5. 交互组件增强
        ----------------------------------- */
        .list-item, .arco-table-tr { transition: background-color 0.2s ease, transform 0.1s ease !important; border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important; }
        .list-item:last-child { border-bottom: none !important; }
        .list-item:hover, .arco-table-tr:hover .arco-table-td { background-color: rgba(255, 255, 255, 0.1) !important; }
        .list-item:active, .arco-table-tr:active .arco-table-td { transform: scale(0.98); background-color: rgba(255, 255, 255, 0.15) !important; }

        img[src*="flags"] { border-radius: 50% !important; border: 2px solid rgba(255, 255, 255, 0.3) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.5); object-fit: cover; }

        .arco-btn { transition: all 0.2s ease !important; font-weight: 600 !important; }
        .arco-btn:active { transform: scale(0.92) !important; }
        .arco-btn-shape-square { border-radius: 8px !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .arco-btn-status-danger { background-color: rgba(239, 68, 68, 0.85) !important; color: #fff !important; backdrop-filter: blur(4px); }
        .arco-btn-status-danger:hover { background-color: rgba(220, 38, 38, 1) !important; box-shadow: 0 0 12px rgba(239, 68, 68, 0.6); }

        .arco-input {
            background-color: rgba(0, 0, 0, 0.4) !important; border-radius: 8px !important; border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #FFFFFF !important; font-weight: 500 !important; backdrop-filter: blur(8px); transition: all 0.3s ease !important;
        }
        .arco-input:focus { background-color: rgba(0, 0, 0, 0.6) !important; border-color: var(--arcoblue-6) !important; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4) !important; transform: translateY(-1px); }
        .arco-input::placeholder { color: rgba(255, 255, 255, 0.6) !important; }

        ::-webkit-scrollbar { width: 4px !important; height: 4px !important; }
        ::-webkit-scrollbar-track { background: transparent !important; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3) !important; border-radius: 10px !important; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5) !important; }
        .arco-tabs-header { border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; }
        .arco-switch { border: 1px solid rgba(255, 255, 255, 0.3) !important; background-color: rgba(0,0,0,0.5) !important; transition: all 0.2s ease !important; }
        .arco-switch:active { transform: scale(0.9) !important; }

        @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
    `;

    function applyModernization() {
        bypassHotlink();
        if (document.getElementById('modernize-365vpn-dynamic-css')) {
            document.getElementById('modernize-365vpn-dynamic-css').remove();
        }
        const style = document.createElement('style');
        style.id = 'modernize-365vpn-dynamic-css';
        style.type = 'text/css';
        style.textContent = dynamicDashboardStyles;
        document.documentElement.appendChild(style);
    }

    document.addEventListener('DOMContentLoaded', applyModernization);
    applyModernization();
})();