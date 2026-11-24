<template>
  <aside class="sidebar" aria-label="Navegación">
    <div class="sidebar-brand" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="27" height="27" fill="none">
        <path
          d="M7 23.5V8.5h8.2a5.2 5.2 0 1 1 0 10.4H11"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M18 18.5h6.5M21.25 15.25v6.5M11 23.5v-6"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <a href="#panel" class="sidebar-icon" title="Inicio" aria-label="Inicio">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path d="m3.5 10 8.5-7 8.5 7v9.5h-6v-6h-5v6h-6V10Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </a>
    <a
      href="#CrearTutoria"
      class="sidebar-icon tutorias-icon"
      title="CrearTutoria"
      aria-label="CrearTutoria"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="16" rx="3" stroke="currentColor" stroke-width="1.8" />
        <path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h3M8 16.5h3M14 13h2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </a>
    <a
      href="#biblioteca"
      class="sidebar-icon biblioteca-icon"
      title="Biblioteca"
      aria-label="Biblioteca"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path d="M3.5 6.5h4v14h-4zM10 4.5h4v16h-4zM16.5 7h4v13.5h-4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
        <path d="M5 9h1M11.5 7h1M18 9.5h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </a>
    <a
      href="#perfil"
      class="sidebar-icon perfil-icon"
      title="Perfil"
      aria-label="Perfil de usuario"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </a>
  </aside>
</template>
<style scoped>
.sidebar {
  position: fixed;
  left: 18px;
  top: 18px;
  bottom: 18px;
  width: 78px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 24px;
  background: linear-gradient(180deg, #245c41 0%, #1d4935 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 19px 0;
  box-shadow: 0 16px 38px rgba(25, 62, 42, 0.2);
  z-index: 10;
}

.sidebar-brand {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  margin-bottom: 24px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  color: #e4f2e8;
}

.sidebar-icon {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c4d9cb;
  text-decoration: none;
  border-radius: 15px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.biblioteca-icon {
  margin-top: 12px;
}

.perfil-icon {
  margin-top: auto;
}

.sidebar-icon:hover {
  background-color: rgba(255, 255, 255, 0.14);
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 700px) {
  .sidebar {
    width: 58px;
    left: 10px;
    top: 10px;
    bottom: 10px;
    padding: 13px 0;
    border-radius: 20px;
  }

  .sidebar-brand {
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
  }

  .sidebar-icon {
    width: 42px;
    height: 42px;
  }
}
</style>
