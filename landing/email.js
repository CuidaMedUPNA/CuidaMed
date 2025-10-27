const btn = document.getElementById("send-button");
const modal = document.getElementById("notify-modal");
console.log(btn);
document
  .getElementById("notify-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    btn.value = "Sending...";

    const serviceID = "default_service";
    const templateID = "bienvenida";

    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        btn.value = "Notifícame";
        alert("¡Gracias por suscribirte! Te notificaremos cuando lancemos.");
        document.getElementById("notify-form").reset();
        modal.style.display = "none";
      },
      (err) => {
        btn.value = "Notifícame";
        alert(JSON.stringify(err));
      }
    );
  });
