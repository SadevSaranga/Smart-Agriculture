document.addEventListener("DOMContentLoaded", function () {
      const elements = document.querySelectorAll('[data-include]');
      elements.forEach(async (el) => {
        const file = el.getAttribute('data-include');
        if (file) {
          try {
            const res = await fetch(file);
            if (res.ok) {
              el.innerHTML = await res.text();
            } else {
              el.innerHTML = "Error loading content.";
            }
          } catch (e) {
            el.innerHTML = "Error fetching file.";
          }
        }
      });
    });