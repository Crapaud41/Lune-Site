(() => {
  const style = document.createElement("style");
  style.textContent = `
    .frog-egg-trigger {
      position: fixed;
      z-index: 9000;
      right: 14px;
      bottom: 12px;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      color: inherit;
      background: transparent;
      opacity: .24;
      cursor: pointer;
      font-size: 17px;
      filter: grayscale(.35);
      transition: opacity .2s ease, transform .2s ease, filter .2s ease;
    }

    .frog-egg-trigger:hover,
    .frog-egg-trigger:focus-visible {
      opacity: 1;
      filter: none;
      transform: scale(1.18);
      outline: none;
    }

    .frog-egg-scene {
      position: fixed;
      z-index: 9999;
      inset: 0;
      overflow: hidden;
      background:
        radial-gradient(ellipse at 50% 82%, rgba(69, 82, 115, .22), transparent 52%),
        linear-gradient(145deg, rgba(8, 12, 24, .97), rgba(17, 23, 42, .98));
      animation: frog-egg-appear .35s ease-out both;
    }

    .frog-egg-caption {
      position: absolute;
      top: 25%;
      left: 50%;
      width: max-content;
      max-width: calc(100vw - 40px);
      margin: 0;
      color: #e8c17a;
      font: italic clamp(18px, 2.5vw, 26px) Georgia, "Times New Roman", serif;
      text-align: center;
      opacity: 0;
      transform: translate(-50%, 8px);
      animation: frog-egg-caption-in .55s ease-out .3s forwards;
    }

    .frog-egg-cat {
      position: absolute;
      bottom: 13vh;
      left: 0;
      width: clamp(220px, 30vw, 360px);
      overflow: visible;
      animation: frog-egg-walk 4s cubic-bezier(.42, 0, .42, 1) both;
    }

    .frog-egg-cat-body {
      fill: #e9e1d3;
      stroke: #22283a;
      stroke-width: 3;
      stroke-linejoin: round;
    }

    .frog-egg-cat-patch {
      fill: #626a78;
    }

    .frog-egg-cat-tail {
      fill: none;
      stroke: #e9e1d3;
      stroke-width: 13;
      stroke-linecap: round;
      transform-origin: 73px 91px;
      animation: frog-egg-tail .42s ease-in-out infinite alternate;
    }

    .frog-egg-leg {
      fill: none;
      stroke: #d5cbbc;
      stroke-width: 11;
      stroke-linecap: round;
      transform-box: fill-box;
      transform-origin: top center;
    }

    .frog-egg-leg-a {
      animation: frog-egg-step .34s ease-in-out infinite alternate;
    }

    .frog-egg-leg-b {
      animation: frog-egg-step .34s ease-in-out .17s infinite alternate-reverse;
    }

    .frog-egg-rider {
      transform-origin: 156px 54px;
      animation: frog-egg-bob .34s ease-in-out infinite alternate;
    }

    .frog-egg-frog-body {
      fill: #94bd70;
      stroke: #334a3a;
      stroke-width: 3;
    }

    .frog-egg-eye {
      fill: #f4e8bb;
      stroke: #334a3a;
      stroke-width: 2;
    }

    .frog-egg-pupil {
      fill: #22283a;
    }

    @keyframes frog-egg-appear {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes frog-egg-caption-in {
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    @keyframes frog-egg-walk {
      from { transform: translateX(-110%); }
      to { transform: translateX(calc(100vw + 110%)); }
    }

    @keyframes frog-egg-step {
      from { transform: rotate(-22deg); }
      to { transform: rotate(22deg); }
    }

    @keyframes frog-egg-tail {
      from { transform: rotate(-10deg); }
      to { transform: rotate(11deg); }
    }

    @keyframes frog-egg-bob {
      from { transform: rotate(-4deg) translateY(1px); }
      to { transform: rotate(4deg) translateY(-3px); }
    }

    @media (max-width: 600px) {
      .frog-egg-cat {
        bottom: 17vh;
        width: 230px;
      }

      .frog-egg-caption {
        top: 28%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .frog-egg-scene,
      .frog-egg-caption {
        animation-duration: .01ms;
        animation-delay: 0s;
      }

      .frog-egg-cat {
        animation-duration: .8s;
      }

      .frog-egg-leg-a,
      .frog-egg-leg-b,
      .frog-egg-tail,
      .frog-egg-rider {
        animation-duration: .5s;
      }
    }
  `;
  document.head.append(style);

  const trigger = document.createElement("button");
  trigger.className = "frog-egg-trigger";
  trigger.type = "button";
  trigger.textContent = "🐸";
  trigger.setAttribute("aria-label", "Découvrir le crapaud caché");
  trigger.title = "Psst…";
  document.body.append(trigger);

  trigger.addEventListener("click", () => {
    if (document.querySelector(".frog-egg-scene")) return;

    const scene = document.createElement("div");
    scene.className = "frog-egg-scene";
    scene.setAttribute("role", "status");
    scene.setAttribute("aria-label", "Un chat traverse l’écran avec un crapaud sur le dos.");

    scene.innerHTML = `
      <p class="frog-egg-caption">On dirait qu’un crapaud a trouvé un taxi.</p>

      <svg class="frog-egg-cat" viewBox="0 0 300 170" aria-hidden="true">
        <path class="frog-egg-cat-tail" d="M76 95 C 42 101, 35 67, 56 56 C 67 50, 78 59, 72 69"/>

        <path class="frog-egg-cat-body"
          d="M65 76
             C78 54 111 49 151 58
             C176 63 190 80 194 101
             L179 115 L85 115
             C67 108 58 93 65 76Z"/>

        <path class="frog-egg-cat-patch"
          d="M92 65 C106 56 126 57 138 64 C130 77 112 83 96 79Z"/>

        <path class="frog-egg-cat-body"
          d="M176 78
             C181 56 199 43 222 47
             L241 62 L254 69 L247 88
             C237 99 216 101 197 94Z"/>

        <path class="frog-egg-cat-body" d="M199 51 L201 30 L217 46Z"/>
        <path class="frog-egg-cat-body" d="M225 47 L239 31 L241 61Z"/>

        <path d="M235 72 Q240 75 244 72" fill="none" stroke="#303445" stroke-width="3" stroke-linecap="round"/>
        <circle cx="224" cy="67" r="2.5" fill="#303445"/>
        <path d="M246 78 L259 81 M246 83 L260 88" fill="none" stroke="#9b8f83" stroke-width="2"/>

        <path class="frog-egg-leg frog-egg-leg-a" d="M93 106 L88 139 L77 145"/>
        <path class="frog-egg-leg frog-egg-leg-b" d="M126 108 L130 139 L141 145"/>
        <path class="frog-egg-leg frog-egg-leg-b" d="M165 106 L159 139 L150 145"/>
        <path class="frog-egg-leg frog-egg-leg-a" d="M184 101 L193 135 L205 140"/>

        <g class="frog-egg-rider">
          <ellipse class="frog-egg-frog-body" cx="151" cy="55" rx="22" ry="14"/>
          <circle class="frog-egg-eye" cx="139" cy="44" r="8"/>
          <circle class="frog-egg-eye" cx="160" cy="44" r="8"/>
          <circle class="frog-egg-pupil" cx="141" cy="44" r="2.5"/>
          <circle class="frog-egg-pupil" cx="162" cy="44" r="2.5"/>
          <path d="M142 59 Q151 66 160 59" fill="none" stroke="#334a3a" stroke-width="2" stroke-linecap="round"/>
        </g>
      </svg>
    `;

    document.body.append(scene);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => scene.remove(), reducedMotion ? 1200 : 4300);
  });
})();
