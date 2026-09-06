(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-clip]").forEach((el) => {
    const text = el.getAttribute("data-clip") || el.textContent.trim();
    el.innerHTML = text
      .split(" ")
      .map((word) => {
        const letters = Array.from(word)
          .map((ch) => `<span class="clip-up">${ch}</span>`)
          .join("");
        return `<span class="clip-word">${letters}</span>`;
      })
      .join(" ");
  });

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    header.classList.toggle("is-clear", y <= 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelector(".more-btn")?.addEventListener("click", (e) => {
    e.currentTarget.parentElement.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".more")) {
      document.querySelector(".more")?.classList.remove("open");
    }
  });

  const menuBtn = document.querySelector(".menu-btn");
  const mobile = document.querySelector(".mobile-nav");
  menuBtn?.addEventListener("click", () => {
    const open = mobile.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
  });

  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const was = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((n) => n.classList.remove("open"));
      if (!was) item.classList.add("open");
      btn.setAttribute("aria-expanded", String(!was));
    });
  });

  document.querySelectorAll("video[data-lazy]").forEach((video) => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
        io.disconnect();
      },
      { rootMargin: "200px" },
    );
    io.observe(video);
  });

  if (reduce) {
    document.querySelectorAll(".sr").forEach((el) => el.classList.add("is-in"));
    return;
  }

  document.querySelectorAll(".sr").forEach((el) => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.remove("is-in");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => el.classList.add("is-in"));
          });
        } else {
          el.classList.remove("is-in");
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
  });
})();
