// drag-button.js
function makeButtonDraggable(button) {
  let isDragging = false;
  let offsetX, offsetY;

  button.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - button.offsetLeft;
    offsetY = e.clientY - button.offsetTop;
    button.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    button.style.cursor = "grab";
  });
}

// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".return-button");
  if (button) makeButtonDraggable(button);
});
// Desactivar clic derecho solo sobre el botón de regresar
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".return-button");
  if (button) {
    button.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Bloquea el menú de clic derecho
    });
  }
});

