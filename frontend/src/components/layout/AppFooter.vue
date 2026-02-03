<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="copyright">
        Progetto ASW Serie A | All rights reserved
      </p>

      <nav class="footer-links">
        <a href="#">Terms & Conditions</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Cookie Policy</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #003366; 
  padding: 3rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: white; 
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.copyright {
  color: white; /* Testo copyright bianco */
  font-size: 1.25rem;
  margin: 0;
  text-align: center;
  font-weight: 600;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.footer-links a {
  color: white; /* Link bianchi */
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: opacity 0.2s ease;
  opacity: 0.8; 
}

.footer-links a:hover {
  opacity: 1;
  text-decoration: underline; 
}

@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style>