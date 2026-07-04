(function () {
  const canvas = document.querySelector("[data-starfield]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas) {
    const context = canvas.getContext("2d");
    let stars = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;

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

      const total = Math.min(240, Math.max(120, Math.floor((width * height) / 6200)));
      stars = Array.from({ length: total }, function () {
        return {
          x: randomBetween(0, width),
          y: randomBetween(0, height),
          radius: randomBetween(0.45, 1.9),
          speed: randomBetween(0.08, 0.34),
          drift: randomBetween(-0.1, 0.16),
          alpha: randomBetween(0.35, 0.95),
          twinkle: randomBetween(0.006, 0.02),
          phase: randomBetween(0, Math.PI * 2)
        };
      });
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      stars.forEach(function (star) {
        star.y += star.speed;
        star.x += star.drift;
        star.phase += star.twinkle;

        if (star.y > height + 6) {
          star.y = -6;
          star.x = randomBetween(0, width);
        }

        if (star.x < -6) {
          star.x = width + 6;
        } else if (star.x > width + 6) {
          star.x = -6;
        }

        const pulse = 0.65 + Math.sin(star.phase) * 0.35;
        context.beginPath();
        context.fillStyle = `rgba(220, 244, 255, ${star.alpha * pulse})`;
        context.shadowColor = "rgba(134, 232, 255, 0.8)";
        context.shadowBlur = star.radius * 5;
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;

      if (!reduceMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

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
})();
