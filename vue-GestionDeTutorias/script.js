function iniciarSesion() {

    let nombre = document.getElementById("nombre").value;
    let contraseña = document.getElementById("contraseña").value;

    if (nombre == "Giovana" && contraseña == "1234") {
        document.getElementById("mensaje").innerHTML = "Inicio de sesión correcto";
    } else {
        document.getElementById("mensaje").innerHTML =
            "El usuario o contraseña no existen o son incorrectos";
    }

}