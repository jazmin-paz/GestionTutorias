<template>
  <aside class="lateral">
    <div class="contador">
      <span>0</span>
      <p>TUTORÍAS</p>
    </div>
    <div class="notificaciones">
      <h3>NOTIFICACIONES</h3>
      <div class="mensaje">
        <span class="punto"></span>
        <p>No hay tutorías pendientes</p>
      </div>
    </div>
  </aside>
</template>
<style scoped>
.lateral {
  display: grid;
  grid-template-columns: minmax(150px, 0.32fr) minmax(0, 1fr);
  gap: 16px;
  width: 100%;
}

.contador,
.notificaciones {
  min-height: 116px;
  border: 1px solid #e3ebe5;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(27, 62, 43, 0.045);
}

.contador {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 24px;
  background: linear-gradient(145deg, #245c41, #34795a);
  color: #fff;
}

.contador span {
  font-size: 34px;
  font-weight: 750;
  letter-spacing: -0.06em;
  line-height: 1;
}

.contador p {
  margin: 9px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.15em;
}

.notificaciones {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px 24px;
}

.notificaciones h3 {
  margin: 0 0 12px;
  color: #46564d;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.12em;
}

.mensaje {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mensaje p {
  margin: 0;
  color: #728078;
  font-size: 14px;
}

.punto {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 50%;
  background: #70ae85;
  box-shadow: 0 0 0 4px #e8f2eb;
}

@media (max-width: 520px) {
  .lateral {
    grid-template-columns: 1fr;
    gap: 11px;
  }

  .contador {
    min-height: 96px;
  }

  .notificaciones {
    min-height: 98px;
  }
}
</style>
