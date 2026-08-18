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
    </svg>`,

    brickbreaker: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Rainbow Bricks cover">
      <rect width="200" height="120" fill="#E4F2FF"/>
      <g stroke="#fff" stroke-width="1.5">
        <rect x="12" y="14" width="34" height="14" rx="3" fill="#FF6F7D"/>
        <rect x="50" y="14" width="34" height="14" rx="3" fill="#FF9D45"/>
        <rect x="88" y="14" width="34" height="14" rx="3" fill="#FFC93C"/>
        <rect x="126" y="14" width="34" height="14" rx="3" fill="#3DDC97"/>
        <rect x="164" y="14" width="24" height="14" rx="3" fill="#4EA8FF"/>
        <rect x="12" y="32" width="34" height="14" rx="3" fill="#9B6BFF"/>
        <rect x="50" y="32" width="34" height="14" rx="3" fill="#FF8FB1"/>
        <rect x="88" y="32" width="34" height="14" rx="3" fill="#FF6F7D"/>
        <rect x="126" y="32" width="34" height="14" rx="3" fill="#FF9D45"/>
        <rect x="164" y="32" width="24" height="14" rx="3" fill="#FFC93C"/>
      </g>
      <circle cx="120" cy="72" r="9" fill="#FFC93C" stroke="#F0A100" stroke-width="1.5"/>
      <rect x="70" y="96" width="60" height="10" rx="5" fill="#2B2145"/>
    </svg>`,

    starcatcher: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Star Catcher cover">
      <rect width="200" height="120" fill="#0a1030"/>
      <circle cx="24" cy="24" r="1.5" fill="#fff"/><circle cx="60" cy="14" r="1" fill="#fff"/>
      <circle cx="90" cy="30" r="1.5" fill="#fff"/><circle cx="140" cy="18" r="1" fill="#fff"/>
      <circle cx="170" cy="34" r="1.5" fill="#fff"/><circle cx="30" cy="70" r="1" fill="#fff"/>
      <circle cx="180" cy="70" r="1.5" fill="#fff"/><circle cx="18" cy="100" r="1" fill="#fff"/>
      <polygon points="50,50 55,60 66,60 57,68 61,79 50,72 39,79 43,68 34,60 45,60" fill="#FFC93C"/>
      <polygon points="140,42 145,52 156,52 147,60 151,71 140,64 129,71 133,60 124,52 135,52" fill="#FFC93C"/>
      <g transform="translate(96 66)">
        <path d="M-14 12 Q0 -18 14 12 L14 26 L-14 26 Z" fill="#fff" stroke="#CFE0EC" stroke-width="1.5"/>
        <circle cx="0" cy="10" r="6" fill="#4EA8FF"/>
        <polygon points="-14,26 -20,32 -14,20" fill="#FF6F7D"/>
        <polygon points="14,26 20,32 14,20" fill="#FF6F7D"/>
        <polygon points="-4,26 4,26 0,40" fill="#FFC93C"/>
      </g>
    </svg>`,

    balloonpop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Balloon Pop cover">
      <rect width="200" height="120" fill="#E4F2FF"/>
      <g>
        <ellipse cx="45" cy="46" rx="18" ry="22" fill="#FF6F7D"/>
        <polygon points="42,66 48,66 45,70" fill="#FF6F7D"/>
        <path d="M45 70 Q48 82 45 100" stroke="#7A6E9C" stroke-width="1.5" fill="none"/>
      </g>
      <g>
        <ellipse cx="100" cy="38" rx="18" ry="22" fill="#4EA8FF"/>
        <polygon points="97,58 103,58 100,62" fill="#4EA8FF"/>
        <path d="M100 62 Q103 80 100 105" stroke="#7A6E9C" stroke-width="1.5" fill="none"/>
      </g>
      <g>
        <ellipse cx="155" cy="50" rx="18" ry="22" fill="#FFC93C"/>
        <polygon points="152,70 158,70 155,74" fill="#FFC93C"/>
        <path d="M155 74 Q158 88 155 105" stroke="#7A6E9C" stroke-width="1.5" fill="none"/>
      </g>
      <g stroke="#fff" stroke-width="3" opacity=".85">
        <line x1="40" y1="30" x2="35" y2="24"/><line x1="42" y1="42" x2="34" y2="42"/><line x1="52" y1="32" x2="58" y2="26"/>
      </g>
    </svg>`,

    whackamole: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Critter Bop cover">
      <rect width="200" height="120" fill="#E4FBF3"/>
      <path d="M0 90 Q100 100 200 90 L200 120 L0 120 Z" fill="#9CF0D4"/>
      <ellipse cx="40" cy="90" rx="22" ry="6" fill="#7A5230" opacity=".4"/>
      <ellipse cx="100" cy="90" rx="22" ry="6" fill="#7A5230" opacity=".4"/>
      <ellipse cx="160" cy="90" rx="22" ry="6" fill="#7A5230" opacity=".4"/>
      <g>
        <circle cx="100" cy="72" r="18" fill="#B98D4B"/>
        <circle cx="94" cy="70" r="3" fill="#2B2145"/><circle cx="106" cy="70" r="3" fill="#2B2145"/>
        <ellipse cx="100" cy="78" rx="4" ry="3" fill="#2B2145"/>
      </g>
      <text x="30" y="46" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="30" fill="#F0A100">BOP!</text>
    </svg>`,

    icecream: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Ice Cream Stack cover">
      <rect width="200" height="120" fill="#FFEAEC"/>
      <polygon points="80,80 120,80 100,116" fill="#F4C989" stroke="#8B5E34" stroke-width="1.5"/>
      <circle cx="100" cy="76" r="24" fill="#FFB8CC" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>
      <circle cx="98" cy="52" r="22" fill="#FFF3D6" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>
      <circle cx="102" cy="30" r="20" fill="#8B5E34" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>
      <circle cx="102" cy="14" r="6" fill="#FF6F7D"/><circle cx="99" cy="12" r="2" fill="#fff" opacity=".5"/>
      <ellipse cx="92" cy="72" rx="5" ry="3" fill="#fff" opacity=".5"/>
      <ellipse cx="90" cy="48" rx="5" ry="3" fill="#fff" opacity=".55"/>
    </svg>`,

    bubblewrap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Bubble Wrap cover">
      <rect width="200" height="120" fill="#E4F2FF"/>
      <g stroke="rgba(43,33,69,.12)" stroke-width="1.5">
        <circle cx="30" cy="30" r="14" fill="#9ED3FF"/><ellipse cx="26" cy="26" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="65" cy="30" r="14" fill="#FFB8CC"/><ellipse cx="61" cy="26" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="100" cy="30" r="14" fill="#FFE58A"/><ellipse cx="96" cy="26" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="135" cy="30" r="14" fill="#9CF0D4"/><ellipse cx="131" cy="26" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="170" cy="30" r="14" fill="#C9B3FF"/><ellipse cx="166" cy="26" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="30" cy="65" r="14" fill="#FFD4B8"/><ellipse cx="26" cy="61" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="65" cy="65" r="14" fill="#9ED3FF"/><ellipse cx="61" cy="61" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <path d="M87 62 l6 6 l14 -14" stroke="#3DDC97" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="135" cy="65" r="14" fill="#FFE58A"/><ellipse cx="131" cy="61" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="170" cy="65" r="14" fill="#FFB8CC"/><ellipse cx="166" cy="61" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="30" cy="100" r="14" fill="#9CF0D4"/><ellipse cx="26" cy="96" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="65" cy="100" r="14" fill="#C9B3FF"/><ellipse cx="61" cy="96" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="100" cy="100" r="14" fill="#FFD4B8"/><ellipse cx="96" cy="96" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="135" cy="100" r="14" fill="#9ED3FF"/><ellipse cx="131" cy="96" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
        <circle cx="170" cy="100" r="14" fill="#FFB8CC"/><ellipse cx="166" cy="96" rx="4" ry="2.5" fill="#fff" opacity=".6"/>
      </g>
    </svg>`,

    butterfly: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Butterfly Catcher cover">
      <rect width="200" height="120" fill="#E4FBF3"/>
      <path d="M0 96 Q100 106 200 96 L200 120 L0 120 Z" fill="#9CF0D4"/>
      <g transform="translate(70 40)">
        <ellipse cx="-12" cy="-4" rx="14" ry="10" fill="#FF6F7D"/>
        <ellipse cx="12" cy="-4" rx="14" ry="10" fill="#FF6F7D"/>
        <ellipse cx="-10" cy="10" rx="10" ry="8" fill="#FF6F7D" opacity=".9"/>
        <ellipse cx="10" cy="10" rx="10" ry="8" fill="#FF6F7D" opacity=".9"/>
        <rect x="-2" y="-8" width="4" height="22" rx="2" fill="#2B2145"/>
      </g>
      <g transform="translate(145 62)">
        <ellipse cx="-12" cy="-4" rx="14" ry="10" fill="#9B6BFF"/>
        <ellipse cx="12" cy="-4" rx="14" ry="10" fill="#9B6BFF"/>
        <ellipse cx="-10" cy="10" rx="10" ry="8" fill="#9B6BFF" opacity=".9"/>
        <ellipse cx="10" cy="10" rx="10" ry="8" fill="#9B6BFF" opacity=".9"/>
        <rect x="-2" y="-8" width="4" height="22" rx="2" fill="#2B2145"/>
      </g>
      <g transform="translate(30 70)">
        <line x1="0" y1="30" x2="18" y2="-4" stroke="#7A5230" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="14" cy="-8" rx="16" ry="12" fill="rgba(255,255,255,.5)" stroke="#7A5230" stroke-width="2"/>
      </g>
    </svg>`,

    piano: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Piano Pals cover">
      <rect width="200" height="120" fill="#FFF6DC"/>
      <rect x="12" y="26" width="176" height="68" rx="6" fill="#2B2145"/>
      <g stroke="#2B2145" stroke-width="1.5">
        <rect x="18" y="32" width="24" height="56" rx="3" fill="#FF6F7D"/>
        <rect x="44" y="32" width="24" height="56" rx="3" fill="#FF9D45"/>
        <rect x="70" y="32" width="24" height="56" rx="3" fill="#FFC93C"/>
        <rect x="96" y="32" width="24" height="56" rx="3" fill="#3DDC97"/>
        <rect x="122" y="32" width="24" height="56" rx="3" fill="#4EA8FF"/>
        <rect x="148" y="32" width="24" height="56" rx="3" fill="#9B6BFF"/>
      </g>
      <g fill="#FFC93C" stroke="#F0A100" stroke-width="1">
        <text x="176" y="20" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="16">♪</text>
        <text x="30" y="20" font-family="Baloo 2, ui-rounded, system-ui" font-weight="800" font-size="14">♫</text>
      </g>
    </svg>`,

    pizza: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Pizza Chef cover">
      <rect width="200" height="120" fill="#FFEAEC"/>
      <circle cx="100" cy="62" r="52" fill="#F0B76A" stroke="#8B5E34" stroke-width="2"/>
      <circle cx="100" cy="62" r="46" fill="#E84D5E"/>
      <circle cx="100" cy="62" r="42" fill="#FFEDB4" opacity="0.85"/>
      <circle cx="82" cy="46" r="6" fill="#B93540"/>
      <circle cx="118" cy="52" r="6" fill="#B93540"/>
      <circle cx="94" cy="72" r="6" fill="#B93540"/>
      <circle cx="120" cy="80" r="5" fill="#B93540"/>
      <circle cx="78" cy="80" r="5" fill="#B93540"/>
      <circle cx="106" cy="46" r="4" fill="none" stroke="#2B2145" stroke-width="2.5"/>
      <circle cx="76" cy="60" r="4" fill="none" stroke="#2B2145" stroke-width="2.5"/>
      <ellipse cx="132" cy="66" rx="6" ry="3" fill="#2FAB70" transform="rotate(20 132 66)"/>
      <ellipse cx="88" cy="90" rx="5" ry="2.5" fill="#2FAB70" transform="rotate(-15 88 90)"/>
    </svg>`,

    rocketrace: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Rocket Race cover">
      <defs><linearGradient id="skyRR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4EA8FF"/><stop offset="1" stop-color="#BFE4FF"/></linearGradient></defs>
      <rect width="200" height="120" fill="url(#skyRR)"/>
      <ellipse cx="34" cy="24" rx="14" ry="8" fill="#fff" opacity=".9"/>
      <ellipse cx="46" cy="26" rx="10" ry="6" fill="#fff" opacity=".9"/>
      <ellipse cx="168" cy="88" rx="16" ry="9" fill="#fff" opacity=".9"/>
      <line x1="0" y1="42" x2="70" y2="42" stroke="#FF6F7D" stroke-width="6" stroke-linecap="round"/>
      <line x1="130" y1="42" x2="200" y2="42" stroke="#FF6F7D" stroke-width="6" stroke-linecap="round"/>
      <line x1="0" y1="74" x2="60" y2="74" stroke="#3DDC97" stroke-width="6" stroke-linecap="round"/>
      <line x1="140" y1="74" x2="200" y2="74" stroke="#3DDC97" stroke-width="6" stroke-linecap="round"/>
      <g transform="translate(100 66)">
        <path d="M-10 -20 Q0 -34 10 -20 L10 12 L-10 12 Z" fill="#fff" stroke="#B7C4D6" stroke-width="1.5"/>
        <circle cx="0" cy="-8" r="6" fill="#4EA8FF"/>
        <circle cx="-2" cy="-10" r="2" fill="#BFE4FF"/>
        <polygon points="-10,12 -16,20 -10,4" fill="#FF6F7D"/>
        <polygon points="10,12 16,20 10,4" fill="#FF6F7D"/>
        <polygon points="-4,12 4,12 0,26" fill="#FFC93C"/>
      </g>
    </svg>`,

    feedmonster: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Feed the Monster cover">
      <rect width="200" height="120" fill="#FFEAEC"/>
      <path d="M60 40 Q60 12 100 12 Q140 12 140 40 L140 96 Q100 116 60 96 Z" fill="#9B6BFF"/>
      <circle cx="82" cy="42" r="12" fill="#fff"/><circle cx="118" cy="42" r="12" fill="#fff"/>
      <circle cx="84" cy="44" r="6" fill="#2B2145"/><circle cx="120" cy="44" r="6" fill="#2B2145"/>
      <circle cx="86" cy="42" r="1.6" fill="#fff"/><circle cx="122" cy="42" r="1.6" fill="#fff"/>
      <ellipse cx="100" cy="72" rx="22" ry="14" fill="#2B2145"/>
      <path d="M82 72 Q100 60 118 72 L114 74 L106 66 L100 74 L94 66 L86 74 Z" fill="#fff"/>
      <circle cx="34" cy="72" r="14" fill="#FF6F7D"/>
      <path d="M32 60 Q32 54 36 54" stroke="#7A5230" stroke-width="2" fill="none"/>
      <circle cx="170" cy="80" r="12" fill="#3DDC97"/>
      <ellipse cx="168" cy="76" rx="4" ry="2.5" fill="#fff" opacity=".5"/>
    </svg>`,

    sushi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Sushi Chef cover">
      <rect width="200" height="120" fill="#FFF6DC"/>
      <rect x="8" y="88" width="184" height="20" rx="3" fill="#DFC58A" stroke="#8B5E34"/>
      <g stroke="#B49459" stroke-width="1">
        <line x1="20" y1="88" x2="20" y2="108"/><line x1="40" y1="88" x2="40" y2="108"/>
        <line x1="60" y1="88" x2="60" y2="108"/><line x1="80" y1="88" x2="80" y2="108"/>
        <line x1="100" y1="88" x2="100" y2="108"/><line x1="120" y1="88" x2="120" y2="108"/>
        <line x1="140" y1="88" x2="140" y2="108"/><line x1="160" y1="88" x2="160" y2="108"/>
        <line x1="180" y1="88" x2="180" y2="108"/>
      </g>
      <g><circle cx="50" cy="66" r="26" fill="#2A2438"/><circle cx="50" cy="66" r="20" fill="#fff"/>
         <ellipse cx="50" cy="60" rx="14" ry="3" fill="#FF8560"/>
         <ellipse cx="50" cy="66" rx="14" ry="3" fill="#B8DE7A"/>
         <ellipse cx="50" cy="72" rx="14" ry="3" fill="#3DDC97"/>
         <circle cx="42" cy="46" r="1.2" fill="#3A2400"/><circle cx="50" cy="44" r="1.2" fill="#3A2400"/><circle cx="58" cy="46" r="1.2" fill="#3A2400"/></g>
      <g><circle cx="110" cy="66" r="26" fill="#F4C1D0"/><circle cx="110" cy="66" r="20" fill="#fff"/>
         <ellipse cx="110" cy="66" rx="14" ry="6" fill="#D9425A"/>
         <circle cx="110" cy="66" r="4" fill="#FF8560"/></g>
      <g><circle cx="170" cy="66" r="26" fill="#F5E6B8"/><circle cx="170" cy="66" r="20" fill="#fff"/>
         <ellipse cx="170" cy="64" rx="14" ry="3" fill="#FFB08A"/>
         <ellipse cx="170" cy="70" rx="14" ry="3" fill="#FFC93C"/></g>
    </svg>`,

    robot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Robot Builder cover">
      <rect width="200" height="120" fill="#E4FBF3"/>
      <g stroke="rgba(47,216,160,.3)" stroke-width="1"><line x1="0" y1="30" x2="200" y2="30"/><line x1="0" y1="60" x2="200" y2="60"/><line x1="0" y1="90" x2="200" y2="90"/></g>
      <ellipse cx="100" cy="108" rx="60" ry="6" fill="rgba(0,0,0,.15)"/>
      <rect x="94" y="34" width="12" height="10" fill="#B7C4D6"/>
      <rect x="66" y="44" width="68" height="60" rx="8" fill="#2FD8A0" stroke="#2A2438" stroke-width="1.5"/>
      <rect x="76" y="52" width="48" height="20" rx="3" fill="rgba(0,0,0,.2)"/>
      <circle cx="82" cy="86" r="3" fill="#FFC93C"/><circle cx="100" cy="86" r="3" fill="#FF6F7D"/><circle cx="118" cy="86" r="3" fill="#4EA8FF"/>
      <rect x="78" y="104" width="14" height="8" fill="#B7C4D6"/><rect x="108" y="104" width="14" height="8" fill="#B7C4D6"/>
      <line x1="66" y1="66" x2="46" y2="72" stroke="#B7C4D6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="44" cy="74" r="5" fill="#2FD8A0" stroke="#2A2438" stroke-width="1"/>
      <line x1="134" y1="66" x2="154" y2="72" stroke="#B7C4D6" stroke-width="5" stroke-linecap="round"/>
      <circle cx="156" cy="74" r="5" fill="#2FD8A0" stroke="#2A2438" stroke-width="1"/>
      <rect x="72" y="10" width="56" height="30" rx="6" fill="#2FD8A0" stroke="#2A2438" stroke-width="1.5"/>
      <circle cx="88" cy="26" r="3.5" fill="#2A2438"/><circle cx="112" cy="26" r="3.5" fill="#2A2438"/>
      <rect x="88" y="34" width="24" height="3" rx="1" fill="#2A2438"/>
      <line x1="100" y1="10" x2="100" y2="0" stroke="#B7C4D6" stroke-width="2"/><circle cx="100" cy="0" r="3" fill="#FFC93C" stroke="#F0A100" stroke-width="1"/>
    </svg>`,

    spaceexplorer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Space Explorer cover">
      <defs><linearGradient id="skyGSE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1444"/><stop offset="1" stop-color="#5B3A9E"/></linearGradient></defs>
      <rect width="200" height="120" fill="url(#skyGSE)"/>
      <g fill="#fff">
        <circle cx="20" cy="24" r="1"/><circle cx="42" cy="14" r="0.8"/><circle cx="66" cy="30" r="1.2"/>
        <circle cx="94" cy="12" r="0.9"/><circle cx="140" cy="22" r="1"/><circle cx="170" cy="10" r="1.3"/>
        <circle cx="186" cy="32" r="1"/><circle cx="14" cy="90" r="1.1"/><circle cx="188" cy="98" r="1"/>
        <circle cx="30" cy="106" r="0.9"/><circle cx="80" cy="102" r="1.1"/>
      </g>
      <g transform="translate(146 66)">
        <ellipse cx="0" cy="0" rx="30" ry="10" fill="none" stroke="#FFC93C" stroke-width="2"/>
        <circle cx="0" cy="0" r="18" fill="#FFC93C" stroke="#F0A100" stroke-width="1.5"/>
        <ellipse cx="0" cy="0" rx="30" ry="10" fill="none" stroke="#FFC93C" stroke-width="2" stroke-dasharray="6 8" opacity="0.5"/>
      </g>
      <circle cx="60" cy="30" r="10" fill="#4EA8FF" stroke="#2A7EE0" stroke-width="1"/>
      <circle cx="30" cy="78" r="8" fill="#FF6F7D" stroke="#B93540" stroke-width="1"/>
      <g transform="translate(90 78)">
        <circle cx="0" cy="0" r="18" fill="#fff" stroke="#B7C4D6" stroke-width="1.5"/>
        <ellipse cx="0" cy="-1" rx="12" ry="9" fill="#2A2438"/>
        <ellipse cx="-4" cy="-3" rx="3" ry="1.6" fill="rgba(255,255,255,.5)"/>
        <line x1="0" y1="-18" x2="0" y2="-24" stroke="#B7C4D6" stroke-width="1.5"/>
        <circle cx="0" cy="-25" r="1.8" fill="#FF6F7D"/>
      </g>
    </svg>`,

    treasure: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" role="img" aria-label="Treasure Dig cover">
      <rect width="200" height="120" fill="#FFF6DC"/>
      <path d="M0 40 L200 40 L200 120 L0 120 Z" fill="#E6C68A"/>
      <path d="M0 40 Q40 30 90 42 T200 40 L200 60 L0 60 Z" fill="#C39858"/>
      <g fill="rgba(60,40,20,.2)">
        <circle cx="20" cy="70" r="1.5"/><circle cx="52" cy="86" r="1.2"/><circle cx="90" cy="70" r="1.8"/>
        <circle cx="130" cy="90" r="1.4"/><circle cx="170" cy="72" r="1.3"/><circle cx="184" cy="98" r="1.6"/>
      </g>
      <g transform="translate(100 78)">
        <polygon points="0,-24 22,-4 0,28 -22,-4" fill="#FF6F7D" stroke="#B93540" stroke-width="2" stroke-linejoin="round"/>
        <polygon points="0,-24 12,-8 -12,-8" fill="rgba(255,255,255,.4)"/>
        <line x1="-22" y1="-4" x2="22" y2="-4" stroke="#B93540" stroke-width="1"/>
      </g>
      <g transform="translate(46 62) rotate(-14)">
        <rect x="-3" y="-16" width="6" height="30" fill="#8B5E34"/>
        <ellipse cx="0" cy="-20" rx="10" ry="6" fill="#B7C4D6" stroke="#2A2438" stroke-width="1"/>
      </g>
      <g fill="#FFC93C" stroke="#F0A100" stroke-width="1">
        <polygon points="170,24 172,30 178,30 173,34 175,40 170,36 165,40 167,34 162,30 168,30"/>
        <polygon points="30,20 31,24 35,24 32,26 33,30 30,28 27,30 28,26 25,24 29,24"/>
      </g>
    </svg>`
  };

  global.SKCovers = {
    get(id) { return COVERS[id] || null; }
  };
})(window);
