/* ============================================================
   FootSense — Firebase Integration
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCj4LJVYqiOIXK8DPDPSCNX7vUV5K6qTFg",
  authDomain: "football-stats-tracking-1406f.firebaseapp.com",
  projectId: "football-stats-tracking-1406f",
  storageBucket: "football-stats-tracking-1406f.firebasestorage.app",
  messagingSenderId: "1054626549260",
  appId: "1:1054626549260:web:2891fa9b3eca85adeaa829",
  measurementId: "G-YB6FTCZDQE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ---------- Email Validation ---------- */
function isValidEmail(email) {
  // RFC-ish check — covers most real-world addresses
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/* ---------- Waitlist Form Handler ---------- */
const form = document.getElementById('waitlist-form');
const emailInput = document.getElementById('waitlist-email');
const nameInput = document.getElementById('waitlist-name');
const submitBtn = document.getElementById('waitlist-submit');
const messageEl = document.getElementById('waitlist-message');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset UI
    messageEl.className = 'form-message';
    messageEl.textContent = '';
    emailInput.classList.remove('error');

    const email = emailInput.value.trim();
    const name = nameInput ? nameInput.value.trim() : '';

    // Validate email
    if (!email) {
      emailInput.classList.add('error');
      showMessage('Lütfen bir e-posta adresi girin.', 'error');
      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      emailInput.classList.add('error');
      showMessage('Lütfen geçerli bir e-posta adresi girin.', 'error');
      emailInput.focus();
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Gönderiliyor...';

    try {
      await addDoc(collection(db, 'waitlist'), {
        email: email,
        name: name || '',
        date: new Date().toISOString(),
        source: 'website'
      });

      // Success
      showMessage('Teşekkürler! Seni haberdar edeceğiz. 🎉', 'success');
      form.reset();
    } catch (error) {
      console.error('Firestore error:', error);

      let msg = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      if (error.code === 'permission-denied') {
        msg = 'Erişim hatası. Lütfen daha sonra tekrar deneyin.';
      } else if (!navigator.onLine) {
        msg = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
      }

      showMessage(msg, 'error');
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Beni Bilgilendir
      `;
    }
  });
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `form-message ${type}`;
}
