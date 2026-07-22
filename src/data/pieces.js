// Sample Pieces & Collections data for the browse section.
export const pieces = [
  {
    id: 1, title: 'El Merlo', subtitle: 'Unknown', identifier: 'IT-1952-RO-CO-047',
    rights: 'All rights reserved', creator: 'Unknown', date: '22 July 2024',
    author: 'Anon.', key: 'G', metre: '2/4', tempo: 'Andante', mode: 'Major',
    instruments: 'Voice', genre: 'Folk Song',
  },
  {
    id: 2, title: 'La gallinita', subtitle: '', identifier: 'IT-1952-RO-CO-048',
    rights: 'CC BY', creator: 'Coleman', date: '22 July 2024',
    author: 'Coleman', key: 'F', metre: '3/4', tempo: '', mode: 'Major',
    instruments: 'Voice', genre: 'Childhood Music',
  },
  {
    id: 3, title: 'Nana', subtitle: 'Lullaby', identifier: 'ES-1948-AN-LL-012',
    rights: 'Public Domain', creator: 'Traditional', date: '14 March 2024',
    author: 'Traditional', key: 'D', metre: '6/8', tempo: 'Lento', mode: 'Minor',
    instruments: 'Voice', genre: 'Lullaby',
  },
  {
    id: 4, title: 'Ave Maris Stella', subtitle: 'Hymn', identifier: 'PT-1610-LX-HY-003',
    rights: 'Public Domain', creator: 'Anon.', date: '02 May 2024',
    author: 'Anon.', key: 'D', metre: '4/4', tempo: 'Maestoso', mode: 'Dorian',
    instruments: 'Choir', genre: 'Sacred',
  },
  {
    id: 5, title: 'El turpial', subtitle: '', identifier: 'VE-1955-CA-CO-021',
    rights: 'CC BY-SA', creator: 'M. Blanco', date: '19 June 2024',
    author: 'M. Blanco', key: 'A', metre: '2/4', tempo: 'Allegro', mode: 'Major',
    instruments: 'Voice, Cuatro', genre: 'Folk Song',
  },
  {
    id: 6, title: 'Pregones', subtitle: 'Street cries', identifier: 'CU-1940-HA-PR-009',
    rights: 'All rights reserved', creator: 'Unknown', date: '11 Jan 2024',
    author: 'Unknown', key: 'C', metre: 'Free', tempo: 'Rubato', mode: 'Major',
    instruments: 'Voice', genre: 'Street Music',
  },
  {
    id: 7, title: '¿Qué haces tú?', subtitle: '', identifier: 'MX-1951-OA-CH-033',
    rights: 'CC BY', creator: 'L. Reyes', date: '28 Aug 2024',
    author: 'L. Reyes', key: 'E', metre: '3/4', tempo: 'Moderato', mode: 'Minor',
    instruments: 'Voice, Guitar', genre: 'Childhood Music',
  },
  {
    id: 8, title: 'O meu menino', subtitle: 'Christmas carol', identifier: 'PT-1958-MI-CA-014',
    rights: 'Public Domain', creator: 'Traditional', date: '05 Dec 2023',
    author: 'Traditional', key: 'G', metre: '4/4', tempo: 'Andantino', mode: 'Major',
    instruments: 'Voice', genre: 'Carol',
  },
]

export const collections = [
  {
    id: 1, code: 'RO-CO-1952', title: 'Romería Collection',
    rights: 'CC BY', country: 'Italy', state: 'Lazio', location: 'Rome',
    century: '20th', decade: '1950s', year: '1952', rightsHolder: 'ITMA',
    pieceIds: [1, 2, 6],
  },
  {
    id: 2, code: 'AN-LL-1948', title: 'Andalusian Lullabies',
    rights: 'Public Domain', country: 'Spain', state: 'Andalusia', location: 'Seville',
    century: '20th', decade: '1940s', year: '1948', rightsHolder: 'CSIC',
    pieceIds: [3, 4],
  },
  {
    id: 3, code: 'CA-CO-1955', title: 'Venezuelan Folk Songs',
    rights: 'CC BY-SA', country: 'Venezuela', state: 'Carabobo', location: 'Valencia',
    century: '20th', decade: '1950s', year: '1955', rightsHolder: 'FUNDEF',
    pieceIds: [5, 7],
  },
  {
    id: 4, code: 'MI-CA-1958', title: 'Iberian Christmas Carols',
    rights: 'All rights reserved', country: 'Portugal', state: 'Minho', location: 'Braga',
    century: '20th', decade: '1950s', year: '1958', rightsHolder: 'INET-md',
    pieceIds: [8, 4],
  },
]

export const getPiece = (id) => pieces.find((p) => p.id === Number(id))
export const getCollection = (id) => collections.find((c) => c.id === Number(id))
export const piecesByIds = (ids) => ids.map((id) => getPiece(id)).filter(Boolean)
