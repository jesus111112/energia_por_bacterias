function enviar() {
    let mensaje = document.getElementById("mensaje").value;

    let form = new FormData();
    form.append("mensaje", mensaje);

    fetch("https://www.nanoenergy.ct.ws/ia.php", {
        method: "POST",
        body: form
    })
    .then(res => res.json())
    .then(data => {
        // Para modelos que devuelven "generated_text"
        let salida = data.generated_text 
                  || data[0]?.generated_text
                  || JSON.stringify(data);

        document.getElementById("respuesta").innerText = salida;
    })
    .catch(err => {
        document.getElementById("respuesta").innerText = "Error: " + err;
    });
}
