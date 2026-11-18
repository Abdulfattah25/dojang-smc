import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/style.css';

// Register PWA Service Worker
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] Versi baru tersedia.');
  },
  onOfflineReady() {
    console.log('[PWA] Aplikasi siap bekerja secara offline.');
  },
});

const app = createApp(App);
app.use(router);
app.mount('#app');
