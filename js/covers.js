/* ============================================================
   SuperKids — covers.js
   One illustrated cover per game, shown as a wide "game cover"
   banner on both the home-page showcase cards and the hub tiles.
   Each cover is a self-contained flat-cartoon SVG scene that
   hints at what the game is about — like the visual game covers
   in Lingo Kids and similar kids' apps.
   All 200×120 viewBox for a consistent 5:3 landscape aspect.
   ============================================================ */
(function (global) {
  'use strict';

  const COVERS = {
    addition: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Number Friends cover">
      <rect width="200" height="120" fill="#FFF6DC"/>
      <text x="24" y="82" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="58" fill="#FF6F7D">2</text>
      <text x="66" y="72" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="32" fill="#F0A100">+</text>
      <text x="90" y="82" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="58" fill="#4EA8FF">3</text>
      <text x="130" y="72" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="32" fill="#F0A100">=</text>
      <text x="152" y="82" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="58" fill="#9B6BFF">5</text>
    </svg>`,

    counting: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Counting Meadow cover">
      <rect width="200" height="120" fill="#E4FBF3"/>
      <path d="M0 90 Q100 100 200 90 L200 120 L0 120 Z" fill="#9CF0D4"/>
      <g stroke="#3DDC97" stroke-width="4" stroke-linecap="round">
        <line x1="30" y1="90" x2="30" y2="72"/>
        <line x1="70" y1="90" x2="70" y2="72"/>
        <line x1="115" y1="90" x2="115" y2="72"/>
        <line x1="160" y1="90" x2="160" y2="72"/>
      </g>
      <g>
        <circle cx="30" cy="60" r="12" fill="#FF6F7D"/><circle cx="30" cy="60" r="4" fill="#FFC93C"/>
        <circle cx="70" cy="60" r="12" fill="#FFC93C"/><circle cx="70" cy="60" r="4" fill="#FF6F7D"/>
        <circle cx="115" cy="60" r="12" fill="#9B6BFF"/><circle cx="115" cy="60" r="4" fill="#FFC93C"/>
        <circle cx="160" cy="60" r="12" fill="#4EA8FF"/><circle cx="160" cy="60" r="4" fill="#FFC93C"/>
      </g>
    </svg>`,

    sorting: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Shape Sorter cover">
      <rect width="200" height="120" fill="#FFEAEC"/>
      <rect x="18" y="72" width="48" height="38" rx="6" fill="#FF6F7D"/>
      <rect x="76" y="72" width="48" height="38" rx="6" fill="#4EA8FF"/>
      <rect x="134" y="72" width="48" height="38" rx="6" fill="#FFC93C"/>
      <circle cx="42" cy="38" r="14" fill="#FF6F7D" stroke="#E84D5E" stroke-width="1.5"/>
      <rect x="86" y="24" width="28" height="28" rx="4" fill="#4EA8FF" stroke="#2A7EE0" stroke-width="1.5"/>
      <polygon points="158,22 176,52 140,52" fill="#FFC93C" stroke="#F0A100" stroke-width="1.5"/>
    </svg>`,

    jigsaw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Jigsaw Friends cover">
      <rect width="200" height="120" fill="#F1EBFF"/>
      <g stroke="#fff" stroke-width="2">
        <path d="M28 20 h60 v20 a6 6 0 0 1 0 12 v20 h-60 z" fill="#FF6F7D"/>
        <path d="M110 20 h60 v52 h-24 a6 6 0 0 0 -12 0 h-24 z" fill="#4EA8FF"/>
        <path d="M28 76 h60 v24 h-60 z" fill="#FFC93C"/>
        <path d="M110 76 h60 v24 h-60 z" fill="#3DDC97"/>
      </g>
    </svg>`,

    letters: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Alphabet Zoo cover">
      <rect width="200" height="120" fill="#E4F2FF"/>
      <text x="30" y="94" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="92" fill="#4EA8FF">A</text>
      <circle cx="142" cy="66" r="28" fill="#FF6F7D"/>
      <path d="M141 40 Q147 30 156 30" stroke="#7A5230" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="153" cy="34" rx="7" ry="4" fill="#3DDC97" transform="rotate(-25 153 34)"/>
      <ellipse cx="132" cy="58" rx="6" ry="4" fill="#fff" opacity="0.55"/>
    </svg>`,

    shapes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Shape Detective cover">
      <rect width="200" height="120" fill="#E4FBF3"/>
      <circle cx="42" cy="60" r="24" fill="#FF6F7D" stroke="#E84D5E" stroke-width="2"/>
      <rect x="80" y="36" width="48" height="48" rx="4" fill="#4EA8FF" stroke="#2A7EE0" stroke-width="2"/>
      <polygon points="164,28 190,84 138,84" fill="#FFC93C" stroke="#F0A100" stroke-width="2"/>
    </svg>`,

    memory: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Memory Match cover">
      <rect width="200" height="120" fill="#FFEAEC"/>
      <g>
        <rect x="24" y="20" width="46" height="80" rx="8" fill="#4EA8FF"/>
        <circle cx="47" cy="60" r="9" fill="#fff"/><circle cx="47" cy="60" r="4" fill="#4EA8FF"/>
        <rect x="77" y="20" width="46" height="80" rx="8" fill="#fff" stroke="#EFE9FA" stroke-width="2"/>
        <polygon points="100,32 106,52 126,52 110,64 116,84 100,72 84,84 90,64 74,52 94,52" fill="#FFC93C"/>
        <rect x="130" y="20" width="46" height="80" rx="8" fill="#9B6BFF"/>
        <circle cx="153" cy="60" r="9" fill="#fff"/><circle cx="153" cy="60" r="4" fill="#9B6BFF"/>
      </g>
    </svg>`,

    patterns: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Pattern Party cover">
      <rect width="200" height="120" fill="#F1EBFF"/>
      <circle cx="28" cy="60" r="14" fill="#FF6F7D"/>
      <polygon points="60,45 78,45 82,60 78,75 60,75 56,60" fill="#FFC93C"/>
      <circle cx="102" cy="60" r="14" fill="#FF6F7D"/>
      <polygon points="134,45 152,45 156,60 152,75 134,75 130,60" fill="#FFC93C"/>
      <circle cx="176" cy="60" r="14" fill="#FF6F7D"/>
    </svg>`,

    exam: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Super Star Exam cover">
      <rect width="200" height="120" fill="#FFF6DC"/>
      <rect x="35" y="18" width="120" height="76" rx="8" fill="#fff" stroke="#F0A100" stroke-width="3"/>
      <line x1="52" y1="38" x2="138" y2="38" stroke="#FFC93C" stroke-width="3" stroke-linecap="round"/>
      <rect x="52" y="52" width="86" height="4" rx="2" fill="#EFE9FA"/>
      <rect x="52" y="62" width="72" height="4" rx="2" fill="#EFE9FA"/>
      <rect x="52" y="72" width="58" height="4" rx="2" fill="#EFE9FA"/>
      <polygon points="154,88 160,102 174,102 163,111 167,124 154,116 141,124 145,111 134,102 148,102" fill="#FFC93C" stroke="#F0A100" stroke-width="1.5"/>
    </svg>`,

    buildbear: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Build-a-Bear cover">
      <rect width="200" height="120" fill="#F1EBFF"/>
      <circle cx="76" cy="34" r="14" fill="#8B5E34"/><circle cx="124" cy="34" r="14" fill="#8B5E34"/>
      <circle cx="76" cy="34" r="7" fill="#F4D9B0"/><circle cx="124" cy="34" r="7" fill="#F4D9B0"/>
      <circle cx="100" cy="55" r="30" fill="#8B5E34"/>
      <ellipse cx="100" cy="66" rx="15" ry="10" fill="#F4D9B0"/>
      <circle cx="90" cy="52" r="4.5" fill="#2B2145"/><circle cx="110" cy="52" r="4.5" fill="#2B2145"/>
      <circle cx="91" cy="51" r="1.5" fill="#fff"/><circle cx="111" cy="51" r="1.5" fill="#fff"/>
      <ellipse cx="100" cy="63" rx="4" ry="3" fill="#2B2145"/>
      <path d="M100 66 Q100 73 96 73 M100 66 Q100 73 104 73" stroke="#2B2145" stroke-width="1.5" fill="none"/>
      <ellipse cx="100" cy="105" rx="38" ry="18" fill="#8B5E34"/>
      <ellipse cx="100" cy="107" rx="18" ry="10" fill="#F4D9B0"/>
    </svg>`,

    buildsnowman: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Build-a-Snowman cover">
      <rect width="200" height="120" fill="#E4F2FF"/>
      <ellipse cx="100" cy="116" rx="42" ry="4" fill="#CFE0EC" opacity="0.6"/>
      <circle cx="100" cy="90" r="26" fill="#fff" stroke="#CFE0EC" stroke-width="2"/>
      <circle cx="100" cy="60" r="20" fill="#fff" stroke="#CFE0EC" stroke-width="2"/>
      <circle cx="100" cy="34" r="16" fill="#fff" stroke="#CFE0EC" stroke-width="2"/>
      <rect x="82" y="20" width="36" height="4" fill="#2B2145"/>
      <rect x="88" y="10" width="24" height="12" fill="#2B2145"/>
      <rect x="88" y="18" width="24" height="3" fill="#FF6F7D"/>
      <circle cx="94" cy="32" r="2" fill="#2B2145"/><circle cx="106" cy="32" r="2" fill="#2B2145"/>
      <polygon points="100,36 114,40 100,42" fill="#FF8A3D"/>
      <path d="M78 47 Q100 55 122 47 L122 55 Q100 63 78 55 Z" fill="#FF6F7D"/>
      <circle cx="100" cy="55" r="1.8" fill="#2B2145"/>
      <circle cx="100" cy="82" r="2" fill="#2B2145"/><circle cx="100" cy="90" r="2" fill="#2B2145"/><circle cx="100" cy="98" r="2" fill="#2B2145"/>
    </svg>`,

    carwash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Car Wash cover">
      <rect width="200" height="120" fill="#E4FBF3"/>
      <g transform="translate(30 40)">
        <path d="M20 30 Q30 8 65 8 Q100 8 110 30 Z" fill="#4EA8FF"/>
        <rect x="0" y="30" width="140" height="26" rx="10" fill="#4EA8FF"/>
        <path d="M26 30 Q34 12 62 12 L62 30 Z" fill="#BFE4FF"/>
        <path d="M68 12 Q96 12 104 30 L68 30 Z" fill="#BFE4FF"/>
        <rect x="62" y="12" width="4" height="18" fill="#2A7EE0"/>
        <rect x="8" y="49" width="124" height="6" rx="3" fill="#2B2145" opacity="0.85"/>
        <circle cx="34" cy="60" r="12" fill="#2B2145"/><circle cx="34" cy="60" r="5" fill="#D9D9E2"/>
        <circle cx="106" cy="60" r="12" fill="#2B2145"/><circle cx="106" cy="60" r="5" fill="#D9D9E2"/>
      </g>
      <circle cx="26" cy="30" r="7" fill="#fff" opacity="0.95"/>
      <circle cx="34" cy="20" r="4" fill="#fff" opacity="0.95"/>
      <circle cx="172" cy="34" r="8" fill="#fff" opacity="0.95"/>
      <circle cx="182" cy="24" r="5" fill="#fff" opacity="0.95"/>
      <circle cx="178" cy="52" r="4" fill="#fff" opacity="0.95"/>
    </svg>`,

    buildcake: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Build-a-Cake cover">
      <rect width="200" height="120" fill="#FFEAEC"/>
      <ellipse cx="100" cy="110" rx="66" ry="6" fill="#fff" stroke="#EDE4D2" stroke-width="1.5"/>
      <rect x="42" y="72" width="116" height="36" rx="8" fill="#FFB8CC"/>
      <ellipse cx="100" cy="72" rx="58" ry="6" fill="#E88AA0"/>
      <rect x="58" y="46" width="84" height="28" rx="8" fill="#FFB8CC"/>
      <ellipse cx="100" cy="46" rx="42" ry="5" fill="#E88AA0"/>
      <rect x="74" y="24" width="52" height="24" rx="8" fill="#FFB8CC"/>
      <ellipse cx="100" cy="24" rx="26" ry="4" fill="#E88AA0"/>
      <rect x="97" y="10" width="6" height="16" rx="1" fill="#fff" stroke="#EDE4D2" stroke-width="1"/>
      <ellipse cx="100" cy="8" rx="4" ry="6" fill="#FFC93C"/>
    </svg>`
  };

  global.SKCovers = {
    get(id) { return COVERS[id] || null; }
  };
})(window);
