function enviar() {
    let texto = document.getElementById("mensaje").value;

    let formData = new FormData();
    formData.append("mensaje", texto);

    fetch("http://www.nanoenergy.ct.ws/ia.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        let salida = data[0]?.generated_text ?? "Sin respuesta";

        document.getElementById("respuesta").innerText = salida;
    })
    .catch(err => {
        document.getElementById("respuesta").innerText = "Error de conexión: " + err;
    });
}
