<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TheNavbar from '@/components/TheNavbar.vue'
import BottomBar from '@/components/BottomBar.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { logIn } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const mode = ref('signin') // 'signin' | 'signup'

function submit() {
  logIn()
  router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
}
</script>

<template>
  <div class="page login-page">
    <TheNavbar accent="purple" />

    <main class="login">
      <form class="login__form" @submit.prevent="submit">
        <span class="login__logo"><BrandLogo :size="30" /></span>

        <div class="login__field">
          <label class="login__label" for="login-email">E-Mail</label>
          <input id="login-email" class="login__input" type="email" autocomplete="email" />
        </div>

        <div class="login__field">
          <label class="login__label" for="login-pass">Password</label>
          <input id="login-pass" class="login__input" type="password" autocomplete="current-password" />
        </div>

        <!-- Register replaces the login form in place (Figma login variant 2) -->
        <div v-if="mode === 'signup'" class="login__field">
          <label class="login__label" for="login-confirm">Confirm Password</label>
          <input id="login-confirm" class="login__input" type="password" autocomplete="new-password" />
        </div>

        <div class="login__foot" :class="{ 'login__foot--end': mode === 'signup' }">
          <p v-if="mode === 'signin'" class="login__register">
            Dont have an account?
            <button type="button" class="login__register-link" @click="mode = 'signup'">Register Now</button>
          </p>
          <p v-else class="login__register">
            Already have an account?
            <button type="button" class="login__register-link" @click="mode = 'signin'">Sign In</button>
          </p>
          <button type="submit" class="auth-btn"><span>{{ mode === 'signin' ? 'SIGN IN' : 'SIGN UP' }}</span></button>
        </div>
      </form>
    </main>

    <BottomBar accent="purple" />
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
}

.login {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--navbar-height) - var(--bottombar-height));
}

.login__form {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.login__logo {
  color: var(--purple);
  display: block;
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.login__label {
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  font-size: var(--fs-login-label);
  color: #000;
}

.login__input {
  height: 42px;
  border-radius: 45px;
  border: none;
  background: var(--color-gray);
  padding: 0 22px;
  font-family: 'Roboto Mono', monospace;
  font-size: var(--fs-field);
  color: #000;
  outline: none;
}

.login__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 4px;
}

.login__foot--end {
  justify-content: space-between;
}

.login__register {
  font-family: 'Roboto Mono', monospace;
  font-weight: 300;
  font-size: 13px;
  color: #000;
  margin: 0;
}

.login__register-link {
  font-family: inherit;
  font-size: inherit;
  color: #000;
  text-decoration: underline;
  padding: 0;
}

/* Purple hover wash fades in over 600ms (opacity overlay). */
.auth-btn {
  position: relative;
  overflow: hidden;
  padding: 9px 22px;
  border-radius: 45px;
  background: var(--color-gray);
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.05em;
  color: #000;
  white-space: nowrap;
}

.auth-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  background: var(--hover-purple);
  transition: opacity 0.6s ease;
}

.auth-btn:hover::before,
.auth-btn:active::before {
  opacity: 1;
}

.auth-btn > * {
  position: relative;
  z-index: 1;
}

@media (max-width: 560px) {
  .login__label {
    font-size: 18px;
  }
  .login__foot {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
