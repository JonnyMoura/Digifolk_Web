import { ref } from 'vue'

const STORAGE_KEY = 'digifolk_logged_in'

// sessionStorage (not localStorage): the login gate in front of /contribute
// should always appear again for a fresh visit/tab, only staying open while
// the user keeps working within the same browser session.
export const isLoggedIn = ref(sessionStorage.getItem(STORAGE_KEY) === '1')

export function logIn() {
  isLoggedIn.value = true
  sessionStorage.setItem(STORAGE_KEY, '1')
}

export function logOut() {
  isLoggedIn.value = false
  sessionStorage.removeItem(STORAGE_KEY)
}
