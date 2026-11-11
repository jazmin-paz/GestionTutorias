<template>
  <aside class="sidebar" aria-label="Navegación">
    <a href="#panel" class="sidebar-icon" title="Inicio" aria-label="Inicio"
      >🏠</a
    >
    <a
      href="#biblioteca"
      class="sidebar-icon biblioteca-icon"
      title="Biblioteca"
      aria-label="Biblioteca"
      >📚</a
    >
    <a
      href="#inicio"
      class="sidebar-icon perfil-icon"
      title="Perfil"
      aria-label="Perfil"
      >👤</a
    >
  </aside>
</template>
<style scoped>
.sidebar {
  position: fixed;
  left: 20px;
  top: 20px;
  bottom: 20px;
  width: 75px;

  background-color: #57bb7f;
  border-radius: 25px;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 25px 0;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

  z-index: 10;
}

.sidebar-icon {
  width: 50px;
  height: 50px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #269b61;
  text-decoration: none;

  border-radius: 15px;

  font-size: 22px;

  transition: 0.25s ease;
}

.biblioteca-icon {
  margin-top: 25px;
}

.perfil-icon {
  margin-top: auto;
}

.sidebar-icon:hover {
  background-color: #e5f3eb;
  color: #20774d;
  transform: scale(1.05);
}

@media (max-width: 700px) {
  .sidebar {
    width: 60px;

    left: 10px;
    top: 10px;
    bottom: 10px;
  }

  .sidebar-icon {
    width: 45px;
    height: 45px;
  }
}
</style>
