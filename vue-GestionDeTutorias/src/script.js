function restablecer() {

    let email = document.getElementById("email").value;

    if (email == "") {
        document.getElementById("mensaje").innerHTML =
            "Ingresá tu email";
    } else {
        document.getElementById("mensaje").innerHTML =
            "Solicitud enviada correctamente";
    }

}