(function () {
  const canvas = document.querySelector("[data-starfield]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas) {
    const context = canvas.getContext("2d");
    let stars = [];
    let meteors = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastTime = performance.now();
    let nextMeteorAt = lastTime + randomBetween(15000, 30000);
    const parallaxEnabled = document.body.classList.contains("dialogue-page") && !reduceMotion;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;

    function randomBetween(min, max) {
      return min + Math.random() * (max - min);
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const total = Math.min(42, Math.max(18, Math.floor((width * height) / 36000)));
      stars = Array.from({ length: total }, function () {
        const upperSky = Math.random() < 0.82;

        return {
          x: randomBetween(0, width),
          y: upperSky ? randomBetween(0, height * 0.58) : randomBetween(height * 0.58, height),
          radius: randomBetween(0.28, 1.05),
          alpha: randomBetween(0.06, 0.22),
          twinkle: randomBetween(0.0009, 0.0032),
          phase: randomBetween(0, Math.PI * 2),
          depth: randomBetween(4, 18)
        };
      });
    }

    function scheduleMeteor(now) {
      nextMeteorAt = now + randomBetween(15000, 30000);
    }

    function createMeteor() {
      meteors.push({
        x: randomBetween(width * 0.72, width + 160),
        y: randomBetween(28, Math.max(96, height * 0.26)),
        length: randomBetween(120, 190),
        speed: randomBetween(180, 255),
        alpha: randomBetween(0.22, 0.38),
        width: randomBetween(0.8, 1.25)
      });
    }

    function drawStars() {
      stars.forEach(function (star) {
        star.phase += star.twinkle;
        const pulse = 0.72 + Math.sin(star.phase) * 0.28;
        const drawX = star.x + pointerX * star.depth;
        const drawY = star.y + pointerY * star.depth;

        context.beginPath();
        context.fillStyle = `rgba(236, 246, 255, ${star.alpha * pulse})`;
        context.shadowColor = "rgba(214, 231, 246, 0.42)";
        context.shadowBlur = star.radius * 4;
        context.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;
    }

    function drawMeteor(meteor) {
      const tailX = meteor.x + meteor.length;
      const tailY = meteor.y - meteor.length * 0.46;
      const gradient = context.createLinearGradient(tailX, tailY, meteor.x, meteor.y);

      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.72, `rgba(235, 246, 255, ${meteor.alpha * 0.42})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${meteor.alpha})`);

      context.beginPath();
      context.strokeStyle = gradient;
      context.lineWidth = meteor.width;
      context.lineCap = "round";
      context.shadowColor = "rgba(231, 244, 255, 0.42)";
      context.shadowBlur = 8;
      context.moveTo(tailX, tailY);
      context.lineTo(meteor.x, meteor.y);
      context.stroke();
      context.shadowBlur = 0;

      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${meteor.alpha * 0.62})`;
      context.arc(meteor.x, meteor.y, meteor.width * 1.2, 0, Math.PI * 2);
      context.fill();
    }

    function draw(now) {
      const delta = Math.min(48, now - lastTime) / 1000;
      lastTime = now;
      context.clearRect(0, 0, width, height);

      if (parallaxEnabled) {
        pointerX += (targetPointerX - pointerX) * 0.035;
        pointerY += (targetPointerY - pointerY) * 0.035;
      }

      drawStars();

      if (!reduceMotion && now > nextMeteorAt && meteors.length < 2) {
        createMeteor();
        scheduleMeteor(now);
      }

      meteors = meteors.filter(function (meteor) {
        meteor.x -= meteor.speed * delta;
        meteor.y += meteor.speed * 0.46 * delta;
        drawMeteor(meteor);
        return meteor.x > -meteor.length && meteor.y < height + meteor.length;
      });

      if (!reduceMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    }

    resize();
    draw(lastTime);
    window.addEventListener("resize", resize);

    if (parallaxEnabled) {
      window.addEventListener("pointermove", function (event) {
        targetPointerX = (event.clientX / Math.max(width, 1) - 0.5) * 1.2;
        targetPointerY = (event.clientY / Math.max(height, 1) - 0.5) * 1.2;
      });
    }

    if (reduceMotion) {
      window.cancelAnimationFrame(animationFrame);
    }
  }

  const copyButtons = Array.from(document.querySelectorAll("[data-copy-text]"));

  copyButtons.forEach(function (button) {
    const defaultText = button.textContent;

    button.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(button.dataset.copyText);
        button.textContent = "已复制";
        window.setTimeout(function () {
          button.textContent = defaultText;
        }, 1400);
      } catch (error) {
        button.textContent = "复制失败";
      }
    });
  });

  const revealItems = Array.from(document.querySelectorAll(".reveal-on-scroll"));

  if (revealItems.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      revealItems.forEach(function (item) {
        observer.observe(item);
      });
    } else {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }
  }
})();
