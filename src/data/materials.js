// Sample content matching the Figma mock (every card shows the same study).
export const AUTHORS =
  'DIEGO M. JIMÉNEZ-BRAVO, ÁLVARO LOZANO MURCIEGO, JUAN JOSÉ NAVARRO-CÁCERES1, MARÍA NAVARRO-CÁCERES AND TREASA HARKIN'

export const TITLE =
  'Identifying Irish Traditional Music Genres Using Latent Audio Representations'

export const ABSTRACT =
  'Irish traditional music contains a variety of features that help to understand the cultural idiosyncrasies of Irish people. One of the most prominent aspects is genre, which provides information on the musical structure, the composition’s essence and, in turn, offers insights into the cultural nuances and behaviors inherent to a particular community. Identifying genre in traditional music can be challenging without prior specialized musical knowledge. Hence, the integration of technological tools becomes valuable, offering assistance in discerning and categorizing genres, thereby facilitating a broader appreciation and understanding of traditional musical heritage. In this study, we introduce a novel system designed to classify the genre of Irish music by analyzing a latent representation of the raw audio extracted from synthesized scores. We evaluate prevailing genre classification models for Irish traditional music and highlight the need for specialized approaches to capture its unique characteristics. We demonstrate how this novel latent representation could be effective in the task of classifying Irish traditional music genres. To support this research, we compile an extensive score dataset of different types of Irish traditional music scores from The Session platform and the Irish Traditional Music Archive (ITMA). This new dataset can aid in the research and exploration of Irish music genres. We have also developed a practical tool using XML and ABC data formats to assist the ITMA in efficiently cataloguing newly acquired data.'

export const materials = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: TITLE,
  authors: AUTHORS,
}))

// Gallery filter tags (Figma: the small label above each card's title).
export const scientificMaterials = materials.map((m, i) => ({
  ...m,
  type: i % 2 === 0 ? 'Paper' : 'Dataset',
}))

export const educationalMaterials = materials.map((m, i) => ({
  ...m,
  type: i % 2 === 0 ? 'Lesson' : 'Module',
}))
