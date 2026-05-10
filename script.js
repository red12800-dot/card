(function () {
  const card = document.getElementById("card");
  const toast = document.getElementById("toast");

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-visible"));

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        toast.hidden = true;
      }, 300);
    }, 2200);
  }

  document.querySelectorAll(".js-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          throw new Error("no clipboard api");
        }
        showToast("복사했습니다.");
      } catch {
        showToast("이 브라우저에서는 복사를 지원하지 않습니다.");
      }
    });
  });

  if (card && !prefersReducedMotion()) {
    let raf = null;
    const maxTilt = 6;

    function onMove(e) {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${-py * maxTilt}deg) rotateY(${px * maxTilt}deg)`;
      });
    }

    function reset() {
      if (raf) cancelAnimationFrame(raf);
      card.style.transform = "";
    }

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", reset);
    card.addEventListener("blur", reset);
  }
})();
