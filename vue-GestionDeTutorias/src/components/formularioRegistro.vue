<template>
  <section class="formulario">
    <h2>Crea tu cuenta</h2>

    <form @submit.prevent="enviarFormulario" novalidate>
      <div class="campo">
        <label for="registro-nombre">Nombre y apellido</label>
        <input
          id="registro-nombre"
          v-model="nombre"
          type="text"
          placeholder="Nombre"
        />
        <p v-if="errorNombre" class="error-campo">{{ errorNombre }}</p>
      </div>

      <div class="campo">
        <label for="registro-email">Correo electrónico</label>
        <input
          id="registro-email"
          v-model="email"
          type="email"
          placeholder="ejemplo@correo.com"
        />
        <p v-if="errorEmail" class="error-campo">{{ errorEmail }}</p>
      </div>

      <div class="campo">
        <label>¿Qué tipo de usuario eres?</label>
        <div class="selector">
          <div
            class="selector-valor"
            role="button"
            tabindex="0"
            aria-label="Seleccionar rol"
            @keydown.enter="mostrarOpcionesRol = !mostrarOpcionesRol"
            @keydown.space.prevent="mostrarOpcionesRol = !mostrarOpcionesRol"
            @click="mostrarOpcionesRol = !mostrarOpcionesRol"
          >
            <span :class="{ placeholder: rol === '' }">
              {{ rol === '' ? 'Seleccionar rol' : rol }}
            </span>
            <span class="flecha" :class="{ arriba: mostrarOpcionesRol }"
              >▾</span
            >
          </div>

          <ul v-if="mostrarOpcionesRol" class="selector-lista">
            <li
              v-for="opcion in opcionesRol"
              :key="opcion"
              class="selector-opcion"
              role="button"
              tabindex="0"
              @keydown.enter="elegirRol(opcion)"
              @keydown.space.prevent="elegirRol(opcion)"
              @click="elegirRol(opcion)"
            >
              {{ opcion }}
            </li>
          </ul>
        </div>
        <p v-if="errorRol" class="error-campo">{{ errorRol }}</p>
      </div>

      <div class="campo">
        <label for="registro-clave">Contraseña</label>
        <div class="campo-contrasena">
          <input
            id="registro-clave"
            v-model="contrasena"
            :type="mostrarContrasena ? 'text' : 'password'"
            placeholder="Mínimo 8 caracteres"
          />
          <img
            :src="mostrarContrasena ? esconderIcono : verIcono"
            class="icono-ojo"
            role="button"
            tabindex="0"
            alt="Mostrar u ocultar contraseña"
            :aria-label="
              mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'
            "
            @keydown.enter="mostrarContrasena = !mostrarContrasena"
            @keydown.space.prevent="mostrarContrasena = !mostrarContrasena"
            @click="mostrarContrasena = !mostrarContrasena"
          />
        </div>
        <p v-if="errorContrasena" class="error-campo">{{ errorContrasena }}</p>
      </div>

      <div class="campo">
        <label for="registro-confirmar">Confirmar contraseña</label>
        <div
          class="campo-contrasena"
          :class="{
            coincide:
              confirmarContrasena !== '' && contrasena === confirmarContrasena,
            'no-coincide':
              confirmarContrasena !== '' && contrasena !== confirmarContrasena,
          }"
        >
          <input
            id="registro-confirmar"
            v-model="confirmarContrasena"
            :type="mostrarConfirmarContrasena ? 'text' : 'password'"
            placeholder="Verificar la contraseña"
          />
          <img
            :src="mostrarConfirmarContrasena ? esconderIcono : verIcono"
            class="icono-ojo"
            role="button"
            tabindex="0"
            alt="Mostrar u ocultar contraseña"
            :aria-label="
              mostrarConfirmarContrasena
                ? 'Ocultar confirmación'
                : 'Mostrar confirmación'
            "
            @keydown.enter="
              mostrarConfirmarContrasena = !mostrarConfirmarContrasena
            "
            @keydown.space.prevent="
              mostrarConfirmarContrasena = !mostrarConfirmarContrasena
            "
            @click="mostrarConfirmarContrasena = !mostrarConfirmarContrasena"
          />
        </div>
        <p v-if="errorConfirmarContrasena" class="error-campo">
          {{ errorConfirmarContrasena }}
        </p>
      </div>

      <button type="submit">Registrarme</button>
    </form>
  </section>
</template>

<script>
import verIcono from '../assets/icons/ver.svg'
import esconderIcono from '../assets/icons/esconder.svg'
export default {
  name: 'formularioRegistro',
  emits: ['registrar-cuenta'],

  data() {
    return {
      verIcono,
      esconderIcono,
      nombre: '',
      email: '',
      rol: '',
      opcionesRol: ['Equipo de gestión', 'Docente'],
      mostrarOpcionesRol: false,
      contrasena: '',
      confirmarContrasena: '',
      mostrarContrasena: false,
      mostrarConfirmarContrasena: false,
      intentoEnvio: false,
    }
  },

  computed: {
    emailValido() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)
    },

    tieneMayuscula() {
      return /[A-Z]/.test(this.contrasena)
    },

    tieneMinuscula() {
      return /[a-z]/.test(this.contrasena)
    },

    tieneNumero() {
      return /[0-9]/.test(this.contrasena)
    },

    tieneCaracterEspecial() {
      return /[\W_]/.test(this.contrasena)
    },

    contrasenaValida() {
      return (
        this.contrasena.length >= 8 &&
        this.tieneMayuscula &&
        this.tieneMinuscula &&
        this.tieneNumero &&
        this.tieneCaracterEspecial
      )
    },

    errorNombre() {
      if (!this.intentoEnvio) return ''
      return this.nombre.trim() === '' ? 'Completá este campo.' : ''
    },

    errorEmail() {
      if (!this.intentoEnvio) return ''
      if (this.email.trim() === '') return 'Completá este campo.'
      if (!this.emailValido) return 'Ingresá un correo electrónico válido.'
      return ''
    },

    errorRol() {
      if (!this.intentoEnvio) return ''
      return this.rol === '' ? 'Seleccioná una opción.' : ''
    },

    errorContrasena() {
      if (!this.intentoEnvio) return ''
      if (this.contrasena === '') return 'Completá este campo.'
      if (!this.contrasenaValida) {
        return 'Debe tener 8+ caracteres, mayúscula, minúscula, número y carácter especial.'
      }
      return ''
    },

    errorConfirmarContrasena() {
      if (!this.intentoEnvio) return ''
      if (this.confirmarContrasena === '') return 'Completá este campo.'
      if (this.contrasena !== this.confirmarContrasena)
        return 'Las contraseñas no coinciden.'
      return ''
    },

    formularioValido() {
      return (
        this.nombre.trim() !== '' &&
        this.email.trim() !== '' &&
        this.emailValido &&
        this.rol !== '' &&
        this.contrasenaValida &&
        this.confirmarContrasena !== '' &&
        this.contrasena === this.confirmarContrasena
      )
    },
  },

  methods: {
    elegirRol(opcion) {
      this.rol = opcion
      this.mostrarOpcionesRol = false
    },

    enviarFormulario() {
      this.intentoEnvio = true

      if (!this.formularioValido) return

      this.$emit('registrar-cuenta', {
        nombre: this.nombre.trim(),
        email: this.email.trim(),
        rol: this.rol,
        contrasena: this.contrasena,
      })

      this.nombre = ''
      this.email = ''
      this.rol = ''
      this.contrasena = ''
      this.confirmarContrasena = ''
      this.intentoEnvio = false
    },
  },
}
</script>

<style scoped>
.formulario {
  align-items: center;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  background: #e6f1dc;
  padding: 50px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
}

.campo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.campo label {
  align-self: center;
  margin-bottom: 4px;
}

input,
select {
  width: 80%;
  box-sizing: border-box;
  padding: 12px;
  font-size: 16px;
  background: #e6f1dc;
  color: #141d19;
  border: 2px solid #58866a;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

input:focus,
select:focus {
  outline: none;
  border-color: #0c6038;
  box-shadow: 0 0 0 3px rgba(12, 96, 56, 0.2);
}

.selector {
  position: relative;
  width: 80%;
  font-family: Arial, sans-serif;
}

.selector-valor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  font-size: 16px;
  color: #141d19;
  border: 2px solid #58866a;
  border-radius: 8px;
  cursor: pointer;
}

.selector-valor .placeholder {
  color: #9ca3af;
}

.flecha {
  transition: transform 0.2s;
  color: #0c6038;
}

.flecha.arriba {
  transform: rotate(180deg);
}

.selector-lista {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  color: #051109;
  background-color: #e6f1dc;
  border: 2px solid #58866a;
  border-radius: 8px;
  list-style: none;
  margin: 0;
  padding: 4px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.selector-opcion {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.selector-opcion:hover {
  background: #58866a;
}

.campo-contrasena {
  position: relative;
  display: flex;
  width: 80%;
  border-radius: 8px;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.campo-contrasena input {
  width: 100%;
  padding-right: 45px;
}

.campo-contrasena.no-coincide {
  background: rgba(185, 28, 28, 0.08);
}

.campo-contrasena.no-coincide input {
  border-color: #b91c1c;
}

.campo-contrasena.coincide {
  background: rgba(22, 101, 52, 0.08);
}

.campo-contrasena.coincide input {
  border-color: #166534;
}

.icono-ojo {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  user-select: none;
}

.error-campo {
  width: 80%;
  margin: 4px 0 0;
  color: #b91c1c;
  font-size: 13px;
  font-weight: bold;
}

button {
  margin-top: 10px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #0c6038;
  color: #f3e3b2;
  cursor: pointer;
  align-self: center;
  width: 80%;
}

.formulario {
  max-width: 620px;
  margin: 32px auto;
}
.campo {
  width: 100%;
}
@media (max-width: 600px) {
  .formulario {
    padding: 24px 12px;
  }
  input,
  .selector,
  .campo-contrasena,
  .error-campo,
  button {
    width: 100%;
  }
}
</style>
