/* ============================================================
   SuperKids — Build-a-Bear
   Hosted by Luna the Owl. Subject: creative (not graded — every
   finish earns full stars, since creative play shouldn't feel judged).
   ============================================================ */
(function () {
  'use strict';

  function bearSVG(fur) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" role="img" aria-label="Your teddy bear">
      <ellipse cx="76" cy="206" rx="19" ry="14" fill="${fur.dark}"/>
      <ellipse cx="124" cy="206" rx="19" ry="14" fill="${fur.dark}"/>
      <ellipse cx="100" cy="160" rx="50" ry="44" fill="${fur.base}"/>
      <ellipse cx="100" cy="172" rx="28" ry="24" fill="#FFF3DC" opacity="0.95"/>
      <path d="M92 168 L100 158 L108 168 L100 178 Z" fill="${fur.dark}" opacity="0.5"/>
      <rect x="32" y="128" width="30" height="64" rx="15" fill="${fur.base}"/>
      <rect x="138" y="128" width="30" height="64" rx="15" fill="${fur.base}"/>
      <ellipse cx="47" cy="182" rx="11" ry="9" fill="#FFF3DC"/>
      <ellipse cx="153" cy="182" rx="11" ry="9" fill="#FFF3DC"/>
      <circle cx="58" cy="36" r="23" fill="${fur.base}"/>
      <circle cx="142" cy="36" r="23" fill="${fur.base}"/>
      <circle cx="58" cy="38" r="12" fill="#FFF3DC"/>
      <circle cx="142" cy="38" r="12" fill="#FFF3DC"/>
      <circle cx="100" cy="80" r="60" fill="${fur.base}"/>
      <ellipse cx="100" cy="98" rx="30" ry="22" fill="#FFF3DC"/>
      <g>
        <ellipse cx="78" cy="76" rx="15" ry="18" fill="#fff"/>
        <circle cx="79" cy="80" r="7" fill="#2B2145"/><circle cx="75" cy="73" r="2.4" fill="#fff"/>
        <ellipse cx="122" cy="76" rx="15" ry="18" fill="#fff"/>
        <circle cx="123" cy="80" r="7" fill="#2B2145"/><circle cx="119" cy="73" r="2.4" fill="#fff"/>
      </g>
      <ellipse cx="56" cy="96" rx="10" ry="6" fill="#FF88A0" opacity="0.5"/>
      <ellipse cx="144" cy="96" rx="10" ry="6" fill="#FF88A0" opacity="0.5"/>
      <ellipse cx="100" cy="92" rx="8" ry="6" fill="#4A3527"/>
      <path d="M86 104 Q100 114 114 104" stroke="#4A3527" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  const FUR_COLORS = [
    { label: 'Classic Brown', base: '#A9714F', dark: '#8A5A3D' },
    { label: 'Honey', base: '#E0A868', dark: '#C08A4C' },
    { label: 'Cream', base: '#F3DFC1', dark: '#DDC29C' },
    { label: 'Blush Pink', base: '#FFB8CC', dark: '#F291AC' },
    { label: 'Sky Blue', base: '#9ED3FF', dark: '#6FB4EE' },
    { label: 'Lavender', base: '#C9B3FF', dark: '#A98CE8' },
    { label: 'Mint', base: '#9CF0D4', dark: '#63D9AE' },
    { label: 'Silver Grey', base: '#C7C7D1', dark: '#A6A6B4' }
  ];

  const HEAD_ACC = [
    { value: 'none', label: 'None', icon: '·' },
    { value: 'bow', label: 'Bow', icon: '🎀', top: 11 },
    { value: 'crown', label: 'Crown', icon: '👑', top: 10 },
    { value: 'tophat', label: 'Top Hat', icon: '🎩', top: 8 },
    { value: 'cap', label: 'Cap', icon: '🧢', top: 10 }
  ];
  const NECK_ACC = [
    { value: 'none', label: 'None', icon: '·' },
    { value: 'scarf', label: 'Scarf', icon: '🧣' },
    { value: 'bowtie', label: 'Bow Tie', icon: '🎀' },
    { value: 'beads', label: 'Necklace', icon: '📿' }
  ];
  const FACE_ACC = [
    { value: 'none', label: 'None', icon: '·' },
    { value: 'glasses', label: 'Glasses', icon: '👓' },
    { value: 'shades', label: 'Sunglasses', icon: '🕶️' }
  ];
  const HELD_ACC = [
    { value: 'none', label: 'None', icon: '·' },
    { value: 'heart', label: 'Heart', icon: '❤️' },
    { value: 'balloon', label: 'Balloon', icon: '🎈' },
    { value: 'star', label: 'Star', icon: '⭐' },
    { value: 'flower', label: 'Flower', icon: '🌼' }
  ];

  function findIcon(list, value) { const o = list.find((x) => x.value === value); return o && o.value !== 'none' ? o : null; }

  function renderPreview(state) {
    const fur = FUR_COLORS.find((c) => c.label === state.furColor) || FUR_COLORS[0];
    let overlay = '';
    const head = findIcon(HEAD_ACC, state.head);
    if (head) overlay += `<span class="cust-acc" style="left:50%;top:${head.top || 10}%;font-size:8rem;">${head.icon}</span>`;
    const neck = findIcon(NECK_ACC, state.neck);
    if (neck) overlay += `<span class="cust-acc" style="left:50%;top:61%;font-size:5rem;">${neck.icon}</span>`;
    const face = findIcon(FACE_ACC, state.face);
    if (face) overlay += `<span class="cust-acc" style="left:50%;top:35%;font-size:8rem;">${face.icon}</span>`;
    const held = findIcon(HELD_ACC, state.held);
    if (held) overlay += `<span class="cust-acc" style="left:76%;top:82%;font-size:4.2rem;">${held.icon}</span>`;
    return bearSVG(fur) + overlay;
  }

  registerGame({
    id: 'buildbear',
    title: 'Build-a-Bear',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'luna',
    color: 'grape',
    icon: '🧸',
    blurb: 'Pick a fur color and dress up your very own teddy bear!',
    mount(root, ctx) {
      return SKPlay.runCustomizer(root, this, ctx.level, {
        doneLabel: 'Meet your bear! ✨',
        categories: [
          { key: 'furColor', label: 'Fur Color', default: FUR_COLORS[0].label,
            options: FUR_COLORS.map((c) => ({ value: c.label, label: c.label, swatch: c.base })) },
          { key: 'head', label: 'Head Accessory', default: 'none', options: HEAD_ACC },
          { key: 'neck', label: 'Neck Accessory', default: 'none', options: NECK_ACC },
          { key: 'face', label: 'Face Accessory', default: 'none', options: FACE_ACC },
          { key: 'held', label: 'Holding', default: 'none', options: HELD_ACC }
        ],
        renderPreview
      });
    }
  });
})();
