<script setup>
import { useRouter } from 'vue-router'
import PillButton from './PillButton.vue'

const props = defineProps({
  title: { type: String, required: true },
  authors: { type: String, default: '' },
  type: { type: String, default: '' },
  to: { type: [String, Object], default: null },
})

const emit = defineEmits(['cite', 'open'])
const router = useRouter()

// Desktop opens the material-info overlay; mobile still navigates to the
// standalone detail page (Figma scientific/educational_project_page_mobile).
function handleOpen() {
  if (window.innerWidth <= 700 && props.to) {
    router.push(props.to)
  } else {
    emit('open')
  }
}
</script>

<template>
  <article
    class="card"
    role="button"
    tabindex="0"
    @click="handleOpen"
    @keydown.enter="handleOpen"
  >
    <div class="card__head">
      <span v-if="type" class="card__tag">{{ type }}</span>
      <h3 class="card__title">{{ title }}</h3>
      <p v-if="authors" class="card__authors">{{ authors }}</p>
    </div>

    <div class="card__actions" @click.stop>
      <PillButton
        v-if="type && type.toLowerCase() !== 'module'"
        :label="type"
        :icon="type.toLowerCase() === 'lesson' ? 'doc' : 'arrow'"
        small
        @click="handleOpen"
      />
      <PillButton label="More Info" icon="arrow" small @click="handleOpen" />
      <PillButton label="Cite" icon="quote" small @click="emit('cite')" />
    </div>

    <!-- Mobile: the card is a pill row with this arrow on the right -->
    <span class="card__arrow" aria-hidden="true">
      <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3.50263V0.000778738V0H10.5004H2.33353V3.50263H7.1889L0 10.6973L3.29982 14L10.5004 6.79401V11.6761H14V3.50263Z" fill="currentColor" />
      </svg>
    </span>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding: 24px 18px;
  border-radius: 28px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.card:hover {
  background: rgba(216, 216, 216, 0.25);
}

.card__head {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.card__tag {
  font-family: 'Roboto Mono', monospace;
  font-weight: 200;
  font-size: 16px;
  color: #000;
}

.card__title {
  display: block;
  font-family: 'Archivo', sans-serif;
  font-weight: 700;
  font-size: var(--fs-card-title);
  line-height: 1.2;
  color: #000;
  margin: 0;
}

.card__authors {
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: var(--fs-author);
  line-height: 1.4;
  margin: 0;
  color: #000;
}

.card__actions {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
}

.card__arrow {
  display: none;
}

/* Mobile: full-width grey pill row (title + arrow), whole card clickable. */
@media (max-width: 700px) {
  .card {
    position: relative;
    flex-direction: row;
    align-items: center;
    gap: 14px;
    padding: 16px 22px;
    border-radius: 22px;
    background: var(--color-gray);
  }
  .card:hover {
    background: var(--color-gray);
  }
  .card__head {
    flex: 1 1 auto;
    gap: 0;
  }
  .card__tag,
  .card__authors,
  .card__actions {
    display: none;
  }
  .card__title {
    font-size: 13px;
    font-weight: 400;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card__arrow {
    display: flex;
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    color: #000;
  }
  .card__arrow svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
