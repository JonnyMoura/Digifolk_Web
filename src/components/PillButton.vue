<script setup>
// Grey pill action button used across cards and detail pages.
// icon: 'arrow' (external link), 'quote' (cite), 'doc' (lesson) or '' (none).
// accent: 'green' (materials/projects) or 'red' (visualisations) — sets hover gradient.
defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: 'arrow' },
  accent: { type: String, default: 'green' },
  small: { type: Boolean, default: false },
})
</script>

<template>
  <button type="button" class="pill" :class="[`pill--${accent}`, { 'pill--small': small }]">
    <span class="pill__label">{{ label }}</span>

    <svg
      v-if="icon === 'arrow'"
      class="pill__icon"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 3.50263V0.000778738V0H10.5004H2.33353V3.50263H7.1889L0 10.6973L3.29982 14L10.5004 6.79401V11.6761H14V3.50263Z"
        fill="currentColor"
      />
    </svg>

    <svg
      v-else-if="icon === 'quote'"
      class="pill__icon"
      viewBox="0 0 512 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="translate(0,512) scale(0.1,-0.1)">
        <path d="M0 3520 l0 -960 641 0 642 0 -7 -87 c-26 -325 -159 -607 -390 -831 -221 -213 -489 -333 -799 -358 l-87 -7 0 -320 0 -320 103 7 c211 13 427 62 619 140 556 225 990 722 1137 1303 56 221 55 183 58 1331 l4 1062 -961 0 -960 0 0 -960z" />
        <path d="M3200 3520 l0 -960 641 0 642 0 -7 -87 c-26 -325 -159 -607 -390 -831 -221 -213 -489 -333 -798 -358 l-88 -7 0 -320 0 -320 101 7 c484 31 917 226 1253 562 284 283 459 621 539 1037 21 109 21 137 24 1175 l4 1062 -961 0 -960 0 0 -960z" />
      </g>
    </svg>
    <svg
      v-else-if="icon === 'doc'"
      class="pill__icon pill__icon--doc"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 2.5h7L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M13 2.5V8h6M8 13h8M8 16.5h8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.pill {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 7px 16px;
  border-radius: 45px;
  background: var(--color-gray);
  color: #000;
  transition: transform 0.1s ease;
}

/* Gradient lives on an overlay so its opacity (not the gradient itself, which
   CSS can't transition) animates over 600ms. */
.pill::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.pill--green::before {
  background: var(--hover-green);
}

.pill--red::before {
  background: var(--hover-red);
}

.pill:hover::before,
.pill:active::before {
  opacity: 1;
}

.pill:active {
  transform: translateY(1px);
}

.pill__label {
  position: relative;
  z-index: 1;
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: var(--fs-pill);
  white-space: nowrap;
}

.pill__icon {
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  display: block;
}

/* Compact size used for gallery card actions and visualisation previews. */
.pill--small {
  gap: 8px;
  padding: 5px 10px;
}
.pill--small .pill__label {
  font-size: 11px;
}
.pill--small .pill__icon {
  width: 8px;
  height: 8px;
}
.pill--small .pill__icon--doc {
  width: 12px;
  height: 12px;
}
</style>
