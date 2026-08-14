/* ============================================================
   SuperKids — Build-a-Snowman
   Hosted by Bolt the Robot. Subject: creative (not graded).
   ============================================================ */
(function () {
  'use strict';

  const SNOW_TINTS = [
    { label: 'Classic White', base: '#FFFFFF' },
    { label: 'Icy Blue', base: '#EAF6FF' },
    { label: 'Blush Frost', base: '#FFF1F4' },
    { label: 'Lavender Frost', base: '#F3EEFF' },
    { label: 'Mint Frost', base: '#EAFBF3' }
  ];
  const SCARF_COLORS = [
    { label: 'None', value: 'none', icon: '🚫' },
    { label: 'Red', value: '#FF6F7D' },
    { label: 'Blue', value: '#4EA8FF' },
    { label: 'Yellow', value: '#FFC93C' },
    { label: 'Green', value: '#3DDC97' },
    { label: 'Purple', value: '#9B6BFF' },
    { label: 'Orange', value: '#FF9D45' },
    { label: 'Pink', value: '#FF8FB1' }
  ];
  const HAT_ACC = [
    { value: 'none', label: 'None', icon: '·' },
    { value: 'tophat', label: 'Top Hat', icon: '🎩', top: 7 },
    { value: 'cap', label: 'Beanie', icon: '🧢', top: 11 },
    { value: 'party', label: 'Party Hat', icon: '🎉', top: 7 }
  ];
  const FACE_ACC = [
    { value: 'none', label: 'None', icon: '·' },
    { value: 'glasses', label: 'Glasses', icon: '👓' },
    { value: 'shades', label: 'Sunglasses', icon: '🕶️' }
  ];
  const HELD_ACC = [
    { value: 'none', label: 'None', icon: '·' },
    { value: 'broom', label: 'Broom', icon: '🧹' },
    { value: 'present', label: 'Present', icon: '🎁' },
    { value: 'star', label: 'Sparkle', icon: '✨' }
  ];

  function snowmanSVG(tint, scarfColor) {
    const scarf = (scarfColor && scarfColor !== 'none') ? `
      <path d="M68 138 Q100 150 132 138 L132 152 Q100 164 68 152 Z" fill="${scarfColor}"/>
      <rect x="93" y="148" width="15" height="36" rx="5" fill="${scarfColor}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220" role="img" aria-label="Your snowman">
      <ellipse cx="100" cy="216" rx="58" ry="8" fill="#DCEBF5" opacity="0.6"/>
      <line x1="66" y1="112" x2="26" y2="86" stroke="#7A5230" stroke-width="5" stroke-linecap="round"/>
      <line x1="40" y1="96" x2="30" y2="84" stroke="#7A5230" stroke-width="3" stroke-linecap="round"/>
      <line x1="44" y1="104" x2="34" y2="98" stroke="#7A5230" stroke-width="3" stroke-linecap="round"/>
      <line x1="134" y1="112" x2="174" y2="86" stroke="#7A5230" stroke-width="5" stroke-linecap="round"/>
      <line x1="160" y1="96" x2="170" y2="84" stroke="#7A5230" stroke-width="3" stroke-linecap="round"/>
      <line x1="156" y1="104" x2="166" y2="98" stroke="#7A5230" stroke-width="3" stroke-linecap="round"/>
      <circle cx="100" cy="176" r="42" fill="${tint.base}" stroke="#CFE0EC" stroke-width="2.5"/>
      <circle cx="100" cy="118" r="34" fill="${tint.base}" stroke="#CFE0EC" stroke-width="2.5"/>
      <circle cx="100" cy="62" r="27" fill="${tint.base}" stroke="#CFE0EC" stroke-width="2.5"/>
      <ellipse cx="88" cy="52" rx="8" ry="5" fill="#fff" opacity="0.7"/>
      ${scarf}
      <circle cx="100" cy="104" r="4" fill="#2B2145"/><circle cx="100" cy="118" r="4" fill="#2B2145"/><circle cx="100" cy="132" r="4" fill="#2B2145"/>
      <circle cx="91" cy="58" r="4.2" fill="#2B2145"/><circle cx="109" cy="58" r="4.2" fill="#2B2145"/>
      <path d="M100 64 L120 69 L100 74 Z" fill="#FF8A3D"/>
      <circle cx="90" cy="77" r="2" fill="#2B2145"/><circle cx="96" cy="81" r="2" fill="#2B2145"/><circle cx="104" cy="81" r="2" fill="#2B2145"/><circle cx="110" cy="77" r="2" fill="#2B2145"/>
      <ellipse cx="78" cy="66" rx="7" ry="4" fill="#FF88A0" opacity="0.5"/>
      <ellipse cx="122" cy="66" rx="7" ry="4" fill="#FF88A0" opacity="0.5"/>
    </svg>`;
  }

  function findIcon(list, value) { const o = list.find((x) => x.value === value); return o && o.value !== 'none' ? o : null; }

  function renderPreview(state) {
    const tint = SNOW_TINTS.find((t) => t.label === state.tint) || SNOW_TINTS[0];
    const scarfColor = state.scarf === 'none' ? null : state.scarf;
    let overlay = '';
    const hat = findIcon(HAT_ACC, state.hat);
    if (hat) overlay += `<span class="cust-acc" style="left:50%;top:${hat.top || 10}%;font-size:5.5rem;">${hat.icon}</span>`;
    const face = findIcon(FACE_ACC, state.face);
    if (face) overlay += `<span class="cust-acc" style="left:50%;top:27%;font-size:5.2rem;">${face.icon}</span>`;
    const held = findIcon(HELD_ACC, state.held);
    if (held) overlay += `<span class="cust-acc" style="left:86%;top:40%;font-size:3.6rem;">${held.icon}</span>`;
    return snowmanSVG(tint, scarfColor) + overlay;
  }

  registerGame({
    id: 'buildsnowman',
    title: 'Build-a-Snowman',
    subject: 'creative',
    subjectLabel: 'Creative',
    buddy: 'bolt',
    color: 'sky',
    icon: '⛄',
    blurb: 'Pick a scarf, a hat, and dress up your own snow friend!',
    mount(root, ctx) {
      return SKPlay.runCustomizer(root, this, ctx.level, {
        doneLabel: 'Meet your snowman! ✨',
        categories: [
          { key: 'tint', label: 'Snow Color', default: SNOW_TINTS[0].label,
            options: SNOW_TINTS.map((t) => ({ value: t.label, label: t.label, swatch: t.base })) },
          { key: 'scarf', label: 'Scarf Color', default: 'none',
            options: SCARF_COLORS.map((c) => (c.icon ? { value: c.value, label: c.label, icon: c.icon } : { value: c.value, label: c.label, swatch: c.value })) },
          { key: 'hat', label: 'Hat', default: 'none', options: HAT_ACC },
          { key: 'face', label: 'Face Accessory', default: 'none', options: FACE_ACC },
          { key: 'held', label: 'Holding', default: 'none', options: HELD_ACC }
        ],
        renderPreview
      });
    }
  });
})();
