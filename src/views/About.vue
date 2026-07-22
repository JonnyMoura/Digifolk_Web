<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import SquiggleLine from '@/components/SquiggleLine.vue'
import { eaDigifolkWordmark, partnerLogos } from '@/assets/images.js'

const intro =
  'Music is an element that is present in our daily lives. There are different styles of music, including classical, jazz, pop, rock, etc. There is a kind of music, folk music, which is of great interest due to its peculiar characteristics and the social context it represents or has represented. This music is a form of social and cultural identification that allows us to twin and recognize ourselves as folks, and also to promote cultural diversity through knowledge of other music. This project proposes creating a platform that contains and presents information about folk music from European and Iber-American culture. The main goal is to create a whole paradigm in which folk music can be understandable from a ethnomusicological, musical and educative point of view. Furthermore, we aim to bring folk music closer to the public creating an interactive and attractive platform that incorporate multimedia information (audio files, scores, visual information about patterns and similarities, etc.). As the platform will be open to the common public, all people that might be interested in folk music can get access, enjoy the resources or even submit their own materials. Our goal is aligned with three main pillars: i) Create a new paradigm to make the musical and ethnomusicological analysis easier for the community; ii) Show knowledge discovery through the application of new technologies in the platform; iii) Bring folk music to educative and public environments. Our project complies with the digitalization pillars proposed in the strategic plan of MSCA, through the inclusion of computer sciences technologies to get a new vision in music analysis. It also helps to create a more resilient, inclusive and democratic European society and includes actions that are also mentioned in the cluster “Culture, Creative and Inclusive Society”, through the inclusion of folk repertoires that reflect cultural issues from different European and Iber-American regions.'

const goals = [
  {
    label: 'Create a new paradigm to make the musical and ethnomusicological analysis easier for the community',
    items: [
      'Propose a standardised methodology to collect folk music',
      'Propose a standard model that allows a uniform analysis of the repertoire collected.',
      'Create a corpus as a case study to show the possibilities that the platform offers',
    ],
  },
  {
    label: 'Show knowledge discovery through the application of new technologies in the platform',
    items: [
      'To review in detail and design new algorithms related to Musical Information Retrieval (MIR)',
      'To review in detail and design new algorithms related to Natural Language Processing (NLP)',
      'To develop a visual grammar to show the dataset (scores, audio files) and analysis outcomes (patterns, lyrics information, etc).',
    ],
  },
  {
    label: 'Bring folk music to educational and public environments',
    items: [
      'To design a plan that makes the incorporation of such repertoires in educational institutions easier',
      'To help teachers to show their students folk music',
      'To attract students and young people to this repertoire',
      'To incorporate public participation',
    ],
  },
]

const researchFields = ['Music Education', 'Musicology', 'Computer Science']

const methodology = [
  'Analyse and to evaluate published/developed proposals',
  'Recognize the computational and musical requirements (digital formats, computing technologies, programming languages, hardware requirements, server configuration, etc.)',
  'Implement a solution-generation process',
  'Iteratively develop a solution prototype',
  'Integrate a solution with what has been developed in other work packages.',
  'Validate results.',
]

const activities = [
  'WP1.Coordination/Management',
  'WP2.Corpus design and creation',
  'WP3.Design and music analysis',
  'WP4.Multimodal folk music',
  'WP5.Text analysis',
  'WP6.Data visualization',
  'WP7.Education Plans',
  'WP8.Communication/Dissemination',
]
</script>

<template>
  <div class="page about">
    <TheNavbar accent="purple" />

    <main class="page__inner about__inner">
      <img class="about__wordmark" :src="eaDigifolkWordmark" alt="EA DigiFolk" />

      <p class="about__intro">{{ intro }}</p>

      <!-- Goals -->
      <h2 class="about__section-title">Goals</h2>
      <div class="goals">
        <div v-for="(row, i) in goals" :key="i" class="goals__row">
          <p class="goals__label">{{ row.label }}</p>
          <ul class="goals__list">
            <li v-for="(it, j) in row.items" :key="j">{{ it }}</li>
          </ul>
        </div>
      </div>
      <div class="about__divider"><SquiggleLine color="var(--purple)" :count="32" /></div>

      <!-- Research Fields -->
      <h2 class="about__section-title">Research Fields</h2>
      <ul class="about__list">
        <li v-for="f in researchFields" :key="f">{{ f }}</li>
      </ul>
      <div class="about__divider"><SquiggleLine color="var(--purple)" :count="32" /></div>

      <!-- Methodology -->
      <h2 class="about__section-title">Methodology</h2>
      <ol class="about__list about__list--num">
        <li v-for="(m, i) in methodology" :key="i">{{ m }}</li>
      </ol>
      <div class="about__divider"><SquiggleLine color="var(--purple)" :count="32" /></div>

      <!-- Activities -->
      <h2 class="about__section-title">Activities</h2>
      <ul class="about__list">
        <li v-for="a in activities" :key="a">{{ a }}</li>
      </ul>
      <div class="about__divider"><SquiggleLine color="var(--purple)" :count="32" /></div>

      <!-- Partner logos -->
      <div class="about__logos">
        <div v-for="logo in partnerLogos" :key="logo.alt" class="about__logo">
          <img :src="logo.src" :alt="logo.alt" />
        </div>
      </div>
    </main>

    <BottomBar accent="purple" />
  </div>
</template>

<style scoped>
/* Mobile: hamburger top bar. */
@media (max-width: 700px) {
  .about__wordmark {
    width: 86%;
    margin: 6px auto 26px;
  }
  .about__intro {
    font-size: 14px;
  }
  .about__section-title {
    font-size: 26px;
  }
  .goals__label {
    font-size: 18px;
  }
  .about__list li {
    font-size: 16px;
  }
}

.about__inner {
  display: flex;
  flex-direction: column;
}

.about__wordmark {
  width: 100%;
  max-width: 760px;
  height: auto;
  margin: 12px 0 28px;
  display: block;
}

.about__intro {
  font-family: 'Josefin Slab', serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  text-align: left;
  max-width: 915px;
  margin: 0 0 56px;
}

.about__section-title {
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: 43px;
  margin: 0 0 24px;
}

/* Goals: label stacked above its bullet list, not side-by-side columns */
.goals {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 915px;
  margin-bottom: 40px;
}

.goals__row {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.goals__label {
  font-family: 'Archivo', sans-serif;
  font-weight: 400;
  font-size: 21px;
  line-height: 1.3;
  margin: 0;
}

.goals__list {
  list-style: disc;
  text-align: justify;
  margin: 0;
  padding-left: 20px;
}

.goals__list li {
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 4px;
}

/* Generic section lists */
.about__list {
  list-style: disc;
  margin: 0 0 40px;
  padding-left: 32px;
  max-width: 915px;
}

.about__list li {
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: 21px;
  line-height: 1.6;
}

.about__list--num {
  list-style: decimal;
}

.about__divider {
  width: min(832px, 100%);
  margin: 10px 0 40px;
}

/* Partner logos */
.about__logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px 64px;
  padding-top: 20px;
}

.about__logo img {
  display: block;
  max-height: 88px;
  width: auto;
  object-fit: contain;
}

@media (max-width: 820px) {
  .about__section-title {
    font-size: 34px;
  }
}
</style>
