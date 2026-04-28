import { useEffect, useState, useRef } from "react";
import "./App.css";

const words = [
  "Minh Nguyệt ơi em có biết là...",
  "Anh",
  "Yêu",
  "Em",
  "Rất",
  "Nhiềuuuu"
];

function App() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const canvasRef = useRef(null);
  const audioRef = useRef(null); // 🎵 thêm audio ref

  // 🎵 AUTOPLAY MUSIC
  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const playMusic = () => {
      audio.play().catch(() => {});
      document.removeEventListener("click", playMusic);
    };

    // thử autoplay
    audio.play().catch(() => {
      // nếu bị chặn → chờ user click
      document.addEventListener("click", playMusic);
    });

    return () => {
      audio.pause();
    };
  }, []);

  // TEXT ANIMATION
  useEffect(() => {
    if (index < words.length) {
      setVisible(true);

      const showTimer = setTimeout(() => {
        setVisible(false);
      }, 2000);

      const nextTimer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 4000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(nextTimer);
      };
    } else {
      setShowHeart(true);
    }
  }, [index]);

  // HEART CANVAS ANIMATION
  useEffect(() => {
    if (!showHeart) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const rand = Math.random;

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    const heartPosition = (rad) => [
      Math.pow(Math.sin(rad), 3),
      -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
    ];

    const scaleAndTranslate = (pos, sx, sy, dx, dy) => [
      dx + pos[0] * sx,
      dy + pos[1] * sy
    ];

    let pointsOrigin = [];
    let dr = 0.1;

    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 500, 30, 0, 0));

    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 350, 20, 0, 0));

    for (let i = 0; i < Math.PI * 2; i += dr)
      pointsOrigin.push(scaleAndTranslate(heartPosition(i), 200, 12, 0, 0));

    let heartPointsCount = pointsOrigin.length;
    let targetPoints = [];

    const pulse = (kx, ky) => {
      for (let i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [
          kx * pointsOrigin[i][0] + width / 2,
          ky * pointsOrigin[i][1] + height / 2
        ];
      }
    };

    let traceCount = 50;
    let e = [];

    for (let i = 0; i < heartPointsCount; i++) {
      let x = rand() * width;
      let y = rand() * height;

      e[i] = {
        vx: 0,
        vy: 0,
        speed: rand() + 5,
        q: ~~(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,
        f: `hsla(0,${~~(40 * rand() + 60)}%,${~~(60 * rand() + 20)}%,.3)`,
        trace: []
      };

      for (let k = 0; k < traceCount; k++) {
        e[i].trace[k] = { x, y };
      }
    }

    let config = {
      traceK: 0.4,
      timeDelta: 0.01
    };

    let time = 0;

    function loop() {
      let n = -Math.cos(time);
      pulse((1 + n) * 0.5, (1 + n) * 0.5);

      time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;

      ctx.fillStyle = "rgba(0,0,0,.1)";
      ctx.fillRect(0, 0, width, height);

      for (let i = e.length; i--;) {
        let u = e[i];
        let q = targetPoints[u.q];

        let dx = u.trace[0].x - q[0];
        let dy = u.trace[0].y - q[1];
        let length = Math.sqrt(dx * dx + dy * dy);

        if (length < 10) {
          if (rand() > 0.95) {
            u.q = ~~(rand() * heartPointsCount);
          } else {
            if (rand() > 0.99) u.D *= -1;
            u.q += u.D;
            u.q %= heartPointsCount;
            if (u.q < 0) u.q += heartPointsCount;
          }
        }

        u.vx += -dx / length * u.speed;
        u.vy += -dy / length * u.speed;

        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;

        u.vx *= u.force;
        u.vy *= u.force;

        for (let k = 0; k < u.trace.length - 1;) {
          let T = u.trace[k];
          let N = u.trace[++k];
          N.x -= config.traceK * (N.x - T.x);
          N.y -= config.traceK * (N.y - T.y);
        }

        ctx.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
          ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
      }

      requestAnimationFrame(loop);
    }

    loop();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

  }, [showHeart]);

  return (
    <div className="app">
      {!showHeart && (
        <div className="container">
          <div className={`word ${visible ? "show" : "hide"}`}>
            {words[index]}
          </div>
        </div>
      )}

      {showHeart && (
        <canvas ref={canvasRef} className="heart-canvas"></canvas>
      )}
    </div>
  );
}

export default App;