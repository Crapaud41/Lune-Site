(() => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  menu?.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    nav?.classList.toggle("open", !expanded);
  });

  function getPhaseName(phase) {
    const angle = ((phase % 360) + 360) % 360;

    if (angle < 8 || angle >= 352) return "Nouvelle lune";
    if (angle < 82) return "Premier croissant";
    if (angle < 98) return "Premier quartier";
    if (angle < 172) return "Gibbeuse croissante";
    if (angle < 188) return "Pleine lune";
    if (angle < 262) return "Gibbeuse décroissante";
    if (angle < 278) return "Dernier quartier";

    return "Dernier croissant";
  }

  function drawMoon(phase, illumination) {
    const moon = document.getElementById("moon-visual");
    if (!moon) return;

    const angle = ((phase % 360) + 360) % 360;
    const radians = angle * Math.PI / 180;
    const cosine = Math.cos(radians);
    const radius = Math.abs(cosine * 48).toFixed(2);

    let litShape;

    if (illumination > 0.999) {
      litShape = '<circle cx="50" cy="50" r="48" fill="#eee5ce" />';
    } else if (angle < 180) {
      const sweep = cosine >= 0 ? 1 : 0;
      litShape = `
        <path
          d="M 50 2 A 48 48 0 0 1 50 98 A ${radius} 48 0 0 ${sweep} 50 2 Z"
          fill="#eee5ce"
        />
      `;
    } else {
      const sweep = cosine > 0 ? 1 : 0;
      litShape = `
        <path
          d="M 50 2 A 48 48 0 0 0 50 98 A ${radius} 48 0 0 ${sweep} 50 2 Z"
          fill="#eee5ce"
        />
      `;
    }

    moon.innerHTML = `
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <clipPath id="moon-disc">
            <circle cx="50" cy="50" r="48"></circle>
          </clipPath>
        </defs>

        <circle cx="50" cy="50" r="48" fill="#171a24"></circle>

        <g clip-path="url(#moon-disc)">
          ${litShape}
          <g fill="#a99d82" opacity=".48">
            <circle cx="32" cy="33" r="4"></circle>
            <circle cx="68" cy="61" r="6"></circle>
            <circle cx="42" cy="72" r="2.8"></circle>
            <circle cx="60" cy="27" r="2.3"></circle>
          </g>
        </g>
      </svg>
    `;

    moon.setAttribute(
      "title",
      `${getPhaseName(angle)} — ${Math.round(illumination * 100)} % éclairée`
    );
  }

  function updateMoon() {
    const phaseElement = document.getElementById("phase-name");
    if (!phaseElement) return;

    const now = new Date();
    const dateElement = document.getElementById("moon-date");

    if (dateElement) {
      dateElement.textContent = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short"
      }).format(now);
    }

    if (!window.Astronomy) {
      phaseElement.textContent = "Données momentanément indisponibles";
      return;
    }

    try {
      const phase = Astronomy.MoonPhase(now);
      const illumination = (1 - Math.cos(phase * Math.PI / 180)) / 2;
      const previousNewMoon = Astronomy.SearchMoonPhase(0, now, -35);
      const ageInDays = Math.max(
        0,
        (now.getTime() - previousNewMoon.date.getTime()) / 86400000
      );
      const distanceInKm = Astronomy.Libration(now).dist_km;

      phaseElement.textContent = getPhaseName(phase);

      const illuminationElement = document.getElementById("illumination");
      const distanceElement = document.getElementById("distance");
      const ageElement = document.getElementById("age");

      if (illuminationElement) {
        illuminationElement.textContent =
          `${Math.round(illumination * 100)} %`;
      }

      if (distanceElement) {
        distanceElement.textContent =
          `${Math.round(distanceInKm).toLocaleString("fr-FR")} km`;
      }

      if (ageElement) {
        ageElement.textContent =
          `${ageInDays.toFixed(1).replace(".", ",")} jours`;
      }

      drawMoon(phase, illumination);
    } catch (error) {
      phaseElement.textContent = "Données momentanément indisponibles";
      console.error("Calcul lunaire indisponible", error);
    }
  }

  updateMoon();

  if (document.getElementById("phase-name")) {
    window.setInterval(updateMoon, 60_000);
  }

  const photos = window.lunarPhotos || [];
  const gallery = document.getElementById("gallery");

  if (!gallery) return;

  const emptyState = document.getElementById("gallery-empty");
  const dateSearch = document.getElementById("date-search");
  const clearSearch = document.getElementById("clear-search");
  const photoCount = document.getElementById("gallery-count");
  const pageIndicator = document.getElementById("page-indicator");
  const previousButton = document.getElementById("previous-five");
  const nextButton = document.getElementById("next-five");

  let selectedDate = "";
  let currentPage = 0;
  const photosPerPage = 5;

  function renderGallery() {
    const matchingPhotos = selectedDate
      ? photos.filter((photo) => photo.date === selectedDate)
      : photos;

    const pageCount = Math.ceil(matchingPhotos.length / photosPerPage);

    currentPage = Math.min(
      currentPage,
      Math.max(0, pageCount - 1)
    );

    const startIndex = currentPage * photosPerPage;
    const visiblePhotos = matchingPhotos.slice(
      startIndex,
      startIndex + photosPerPage
    );

    gallery.innerHTML = visiblePhotos.map((photo) => {
      const date = new Date(`${photo.date}T12:00:00`).toLocaleDateString(
        "fr-FR",
        { dateStyle: "long" }
      );

      return `
        <article class="photo-tile">
          <img
            src="${photo.src}"
            alt="${photo.alt || "Photographie de la Lune"}"
            loading="lazy"
          >
          <div>
            <strong>${photo.title || "Observation lunaire"}</strong>
            <span>${date}</span>
          </div>
        </article>
      `;
    }).join("");

    const hasPhotos = photos.length > 0;

    if (emptyState) {
      emptyState.hidden = hasPhotos;

      if (selectedDate && matchingPhotos.length === 0 && hasPhotos) {
        emptyState.hidden = false;
        emptyState.querySelector("h2").textContent =
          "Aucune photo à cette date";
        emptyState.querySelector("p").textContent =
          "Essaie une autre date pour retrouver tes observations.";
      }
    }

    if (photoCount) {
      photoCount.textContent = selectedDate
        ? `${matchingPhotos.length} photo${matchingPhotos.length === 1 ? "" : "s"} pour cette date`
        : `${photos.length} photo${photos.length === 1 ? "" : "s"}`;
    }

    if (pageIndicator) {
      pageIndicator.textContent = matchingPhotos.length
        ? `${currentPage + 1} / ${pageCount} · ${matchingPhotos.length} photos`
        : "0 photo";
    }

    if (previousButton) {
      previousButton.disabled = currentPage <= 0;
    }

    if (nextButton) {
      nextButton.disabled = currentPage >= pageCount - 1;
    }

    if (clearSearch) {
      clearSearch.hidden = !selectedDate;
    }
  }

  dateSearch?.addEventListener("change", () => {
    selectedDate = dateSearch.value;
    currentPage = 0;
    renderGallery();
  });

  clearSearch?.addEventListener("click", () => {
    dateSearch.value = "";
    selectedDate = "";
    currentPage = 0;
    renderGallery();
  });

  previousButton?.addEventListener("click", () => {
    currentPage = Math.max(0, currentPage - 1);
    renderGallery();
  });

  nextButton?.addEventListener("click", () => {
    currentPage += 1;
    renderGallery();
  });

  renderGallery();
})();
