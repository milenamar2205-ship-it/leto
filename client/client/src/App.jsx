import { useEffect, useRef, useState } from "react";
import "./App.css";
import mainLogo from "./assets/logo.png";
import footerLogo from "./assets/logo.png";
import cartLogo from "./assets/logo2.png";
import marvelLogo from "./assets/marvel.png";
import starWarsLogo from "./assets/starwars.png";
import dcLogo from "./assets/dc.png";
import animeLogo from "./assets/anime.png";
import gamesLogo from "./assets/games.png";
import aboutMascot from "./assets/logo3.png";

const products = [
  { title: "Фигурка героя", price: "2 499 ₽" },
  { title: "Комикс #01", price: "899 ₽" },
  { title: "Mystery box", price: "1 299 ₽" },
  { title: "Аниме-фигурка", price: "3 199 ₽" },
  { title: "Коллекционный сет", price: "4 999 ₽" },
  { title: "Редкий выпуск", price: "1 599 ₽" },
  { title: "Гик-мерч", price: "999 ₽" },
];
const allProducts = [
  {
    id: 1,
    title: "Фигурка Spider-Man",
    price: 2890,
    category: "Фигурки",
    universe: "Marvel",
  },
  {
    id: 2,
    title: "Комикс Batman #1",
    price: 990,
    category: "Комиксы",
    universe: "DC",
  },
  {
    id: 3,
    title: "Фигурка Levi Ackerman",
    price: 5190,
    category: "Фигурки",
    universe: "Anime",
  },
  {
    id: 4,
    title: "Манга Chainsaw Man",
    price: 750,
    category: "Манга",
    universe: "Anime",
  },
  {
    id: 5,
    title: "Фигурка Darth Vader",
    price: 4490,
    category: "Фигурки",
    universe: "Star Wars",
  },
  {
    id: 6,
    title: "Комикс Deadpool",
    price: 1290,
    category: "Комиксы",
    universe: "Marvel",
  },
  {
  id: 7,
  title: "FAITH: The Unholy Trinity",
  price: 1490,
  category: "Игры",
  universe: "Games",
},
{
  id: 8,
  title: "Постер FAITH",
  price: 690,
  category: "Мерч",
  universe: "Games",
},
{
  id: 9,
  title: "Фигурка священника FAITH",
  price: 2590,
  category: "Фигурки",
  universe: "Games",
},
];

function Header({ setPage, currentUser }) {
  return (
    <header className="site-header">
      <button className="logo" onClick={() => setPage("casino")}>
        ?
      </button>

      <nav className="main-nav">
        <button onClick={() => setPage("home")}>Главная</button>
        <button onClick={() => setPage("products")}>Все товары</button>
        <button onClick={() => setPage("universes")}>Выбери свою вселенную</button>
        <button onClick={() => setPage("about")}>О нас</button>
      </nav>

      <div className="header-actions">
        <button className="header-icon" onClick={() => setPage("favorites")}>
          ♡
        </button>
        <button className="header-icon" onClick={() => setPage("cart")}>
          🛒
        </button>
        {currentUser ? (
          <button className="profile-header-btn" onClick={() => setPage("profile")}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Профиль" />
            ) : (
              <span>
                {(currentUser.nickname || currentUser.login || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </button>
        ) : (
          <button className="login-btn" onClick={() => setPage("login")}>
            ➜ Вход
          </button>
        )}
      </div>
    </header>
  );
}

function HomePage({
  setPage,
  setSelectedCategoryFromHome
}) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const visibleProducts = products.slice(slide, slide + 5);

  function nextSlide() {
    setSlide((current) => {
      if (current + 5 >= products.length) return 0;
      return current + 1;
    });
  }

  function prevSlide() {
    setSlide((current) => {
      if (current === 0) return Math.max(products.length - 5, 0);
      return current - 1;
    });
  }

  function openCategory(category) {
  setSelectedCategoryFromHome(category);
  setCatalogOpen(false);
  setPage("products");
}

  return (
    <main className="home">
      <section className="products-section mario-bg">
        <div className="top-row">
          <div className="small-photo-placeholder">
            <img src={mainLogo} alt="FunUniverse" />
          </div>
        </div>

        {catalogOpen && (
          <aside
            className="catalog-panel"
            onMouseLeave={() => setCatalogOpen(false)}
          >
            <h3>Каталог</h3>
           <button onClick={() => openCategory("Фигурки")}>
  Фигурки
</button>

<button onClick={() => openCategory("Комиксы")}>
  Комиксы
</button>

<button onClick={() => openCategory("Манга")}>
  Манга
</button>

<button onClick={() => openCategory("Игры")}>
  Игры
</button>
          </aside>
        )}

        <div className="section-heading-row">
  <h2 className="section-title">Новинки</h2>

  <button
    className="catalog-btn"
    onMouseEnter={() => setCatalogOpen(true)}
    onClick={() => setCatalogOpen((value) => !value)}
  >
    Каталог
  </button>
</div>

        <div className="slider">
          <button className="slider-arrow left" onClick={prevSlide}>
            ←
          </button>

          <div className="product-list">
            {visibleProducts.map((product, index) => (
              <article className="product-card" key={`${product.title}-${index}`}>
                <div className="product-image">IMG</div>
                <p className="product-desc">{product.title}</p>
                <p className="product-price">{product.price}</p>
                <button className="cart-btn">🛒</button>
              </article>
            ))}
          </div>

          <button className="slider-arrow right" onClick={nextSlide}>
            →
          </button>
        </div>

        <div className="pixel-bg-placeholder"></div>
      </section>

      <DinoRunner />

      <section className="about-section" id="about-project">
        <h2>— Зачем вообще был создан этот проект?</h2>
        <p>
          — Мы сделали его для того чтобы больше никто и никогда не страдал от того,
          что во время гиперфиксов не может найти мерч по своему любимому фандому.
          Чтобы больше никто не чувствовал себя одиноко в своих интересах, мы
          собираем вокруг себя огромное комьюнити единомышленников. Чтобы люди могли
          больше не бегать по разным магазинам, ища подарок для друга, а просто
          заходили к нам. И конечно же мы тут просто для того, чтобы дарить вам
          радость :)
        </p>
      </section>

    </main>
  );
}

function DinoRunner() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const gameOverRef = useRef(null);
  const scoreRef = useRef(null);
  const hiScoreRef = useRef(null);
  const finalScoreRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const overlay = overlayRef.current;
    const gameOverEl = gameOverRef.current;
    const scoreEl = scoreRef.current;
    const hiScoreEl = hiScoreRef.current;
    const finalScoreEl = finalScoreRef.current;

    const GAME_W = 800;
    const GAME_H = 250;
    const GROUND_Y = 178;
    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;

    let dino;
    let obstacles;
    let gameState;
    let score;
    let hiScore;
    let gameSpeed;
    let frameCount;
    let groundOffset;
    let animationId;

    function initGame() {
      dino = {
        x: 70,
        y: GROUND_Y,
        w: 42,
        h: 46,
        vy: 0,
        grounded: true,
      };

      obstacles = [];
      gameState = "idle";
      score = 0;
      gameSpeed = 5;
      frameCount = 0;
      groundOffset = 0;
    }

    function loadHiScore() {
      hiScore = Number(localStorage.getItem("dinoHiScore")) || 0;
      hiScoreEl.textContent = String(hiScore).padStart(5, "0");
    }

    function updateScore() {
      scoreEl.textContent = String(Math.floor(score)).padStart(5, "0");
    }

    function startGame() {
      gameState = "playing";
      overlay.style.display = "none";
      gameOverEl.style.display = "none";
    }

    function resetGame() {
      initGame();
      loadHiScore();
      startGame();
      updateScore();
    }

    function endGame() {
      gameState = "over";

      if (score > hiScore) {
        hiScore = Math.floor(score);
        localStorage.setItem("dinoHiScore", hiScore);
        hiScoreEl.textContent = String(hiScore).padStart(5, "0");
      }

      finalScoreEl.textContent = Math.floor(score);
      gameOverEl.style.display = "flex";
    }

    function jump() {
      if (gameState === "idle") {
        startGame();
        return;
      }

      if (gameState === "over") {
        resetGame();
        return;
      }

      if (dino.grounded) {
        dino.vy = JUMP_FORCE;
        dino.grounded = false;
      }
    }

    function rect(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    }

    function drawDino() {
      const x = dino.x;
      const y = dino.y;
      const px = 4;

      rect(x, y, 8 * px, 8 * px, "#58a6ff");
      rect(x + 8 * px, y - 2 * px, 4 * px, 4 * px, "#58a6ff");
      rect(x + 10 * px, y - 4 * px, 4 * px, 3 * px, "#58a6ff");
      rect(x + 12 * px, y - 3 * px, 2 * px, 2 * px, "#ffffff");
      rect(x - 3 * px, y + 2 * px, 3 * px, 2 * px, "#58a6ff");
      rect(x + 2 * px, y + 2 * px, 5 * px, 4 * px, "#79c0ff");
      rect(x + 1 * px, y + 8 * px, 3 * px, 4 * px, "#3d7abf");
      rect(x + 5 * px, y + 8 * px, 3 * px, 3 * px, "#3d7abf");
    }

    function drawCactus(obstacle) {
      rect(obstacle.x, obstacle.y - obstacle.h, 12, obstacle.h, "#3fb950");
      rect(obstacle.x - 6, obstacle.y - obstacle.h + 8, 6, 12, "#3fb950");
      rect(obstacle.x + 12, obstacle.y - obstacle.h + 14, 6, 12, "#3fb950");
    }

    function drawGround() {
      const y = GROUND_Y + dino.h + 4;

      rect(0, y, GAME_W, 2, "#30363d");

      for (let i = 0; i < GAME_W; i += 28) {
        rect((i - groundOffset) % GAME_W, y + 10, 14, 2, "#21262d");
      }
    }

    function spawnObstacle() {
      obstacles.push({
        x: GAME_W,
        y: GROUND_Y + dino.h + 4,
        w: 22,
        h: 34 + Math.floor(Math.random() * 24),
      });
    }

    function collision(a, b) {
      return (
        a.x + 6 < b.x + b.w &&
        a.x + a.w - 6 > b.x &&
        a.y + 8 < b.y &&
        a.y + a.h > b.y - b.h
      );
    }

    function update() {
      if (gameState !== "playing") return;

      frameCount += 1;
      score += gameSpeed * 0.02;
      updateScore();

      if (frameCount % 220 === 0) {
        gameSpeed = Math.min(gameSpeed + 0.4, 13);
      }

      if (!dino.grounded) {
        dino.vy += GRAVITY;
        dino.y += dino.vy;

        if (dino.y >= GROUND_Y) {
          dino.y = GROUND_Y;
          dino.vy = 0;
          dino.grounded = true;
        }
      }

      groundOffset = (groundOffset + gameSpeed) % GAME_W;

      const last = obstacles[obstacles.length - 1];

      if (!last || last.x < GAME_W - 260 - Math.random() * 120) {
        spawnObstacle();
      }

      obstacles.forEach((obstacle) => {
        obstacle.x -= gameSpeed;
      });

      obstacles = obstacles.filter((obstacle) => obstacle.x > -50);

      for (const obstacle of obstacles) {
        if (collision(dino, obstacle)) {
          endGame();
          break;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, GAME_W, GAME_H);

      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_H);
      gradient.addColorStop(0, "#0d1117");
      gradient.addColorStop(1, "#161b22");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.beginPath();
      ctx.arc(680, 55, 34, 0, Math.PI * 2);
      ctx.fill();

      drawGround();

      obstacles.forEach(drawCactus);
      drawDino();
    }

    function loop() {
      update();
      draw();
      animationId = requestAnimationFrame(loop);
    }

    function onKeyDown(event) {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        jump();
      }
    }

    initGame();
    loadHiScore();
    updateScore();

    document.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("click", jump);
    overlay.addEventListener("click", jump);
    gameOverEl.addEventListener("click", jump);

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("click", jump);
      overlay.removeEventListener("click", jump);
      gameOverEl.removeEventListener("click", jump);
    };
  }, []);

  return (
    <section className="dino-section">
      <div className="stars"></div>

      <div className="dino-content">
        <p className="dino-label">DINO RUNNER</p>
        <h2>Поймай свой рекорд</h2>
        <p className="dino-hint">
          Нажми пробел, кликни или тапни, чтобы прыгнуть
        </p>

        <div className="dino-game">
          <canvas ref={canvasRef} width="800" height="250"></canvas>

          <div ref={overlayRef} className="dino-overlay">
            <div>
              <h3>DINO RUNNER</h3>
              <p>Нажми пробел или тапни чтобы начать</p>
            </div>
          </div>

          <div ref={gameOverRef} className="dino-overlay game-over">
            <div>
              <h3>GAME OVER</h3>
              <p>
                Счёт: <span ref={finalScoreRef}>0</span>
              </p>
              <p>Пробел или тап чтобы начать заново</p>
            </div>
          </div>

          <div className="score">
            SCORE <span ref={scoreRef}>00000</span> HI{" "}
            <span ref={hiScoreRef}>00000</span>
          </div>
        </div>

        <button className="space-btn">SPACE</button>
      </div>
    </section>
  );
}

function LoginPage({ currentUser, setCurrentUser }) {
  const [mode, setMode] = useState("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  

  async function sendAuthRequest(event) {
    event.preventDefault();

    const url =
      mode === "login"
        ? "http://localhost:3001/api/login"
        : "http://localhost:3001/api/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          password: password,
          email: email,
        }),
      });

      const data = await response.json();

      setMessage(data.message);
      setSuccess(data.success);

      if (data.success && mode === "login") {
        setCurrentUser(data.user);
      }

      if (data.success && mode === "register") {
        setMode("login");
        setPassword("");
      }
    } catch (error) {
      setMessage("Ошибка соединения с сервером");
      setSuccess(false);
    }
  }

  function logout() {
    setCurrentUser(null);
    setLogin("");
    setPassword("");
    setMessage("Вы вышли из аккаунта");
    setSuccess(true);
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>{mode === "login" ? "Вход" : "Регистрация"}</h1>

        {currentUser ? (
          <div className="profile-box">
            <p>
              Вы вошли как: <b>{currentUser.nickname || currentUser.login}</b>
            </p>
            <button onClick={logout}>Выйти</button>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                Вход
              </button>

              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
              >
                Создать аккаунт
              </button>
            </div>

            <form onSubmit={sendAuthRequest} className="login-form">
              <input
                type="text"
                placeholder={mode === "login" ? "Логин или почта" : "Придумайте логин"}
                value={login}
                onChange={(event) => setLogin(event.target.value)}
            />
            {mode === "register" && (
              <input
                type="email"
                placeholder="Почта"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            )}

              <input
                type="password"
                placeholder="Придумайте пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button type="submit">
                {mode === "login" ? "Войти" : "Зарегистрироваться"}
              </button>
            </form>
          </>
        )}

        {message && (
          <p className={success ? "login-message success" : "login-message error"}>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
function StubPage({ title }) {
  return (
    <main className="stub-page">
      <h1>{title}</h1>
      <p>Пока это страница-заглушка. Оформление сделаем позже.</p>
    </main>
  );
}

function ProductsPage({
  currentUser,
  favorites,
  toggleFavorite,
  setPage,
  addToCart,
  selectedUniverseFromPage,
  setSelectedUniverseFromPage,

  selectedCategoryFromHome,
  setSelectedCategoryFromHome,
}) {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUniverses, setSelectedUniverses] = useState([]);
  useEffect(() => {
    if (selectedUniverseFromPage) {
     setSelectedUniverses([selectedUniverseFromPage]);
     setSelectedUniverseFromPage("");
    }
  }, [selectedUniverseFromPage, setSelectedUniverseFromPage]);
  const [sortType, setSortType] = useState("default");

  useEffect(() => {
  if (selectedCategoryFromHome) {
    setSelectedCategories([selectedCategoryFromHome]);
    setSelectedCategoryFromHome("");
  }
}, [
  selectedCategoryFromHome,
  setSelectedCategoryFromHome,
]);

  const priceFilters = [
    { label: "до 1000 ₽", value: "low" },
    { label: "1000–3000 ₽", value: "middle" },
    { label: "от 3000 ₽", value: "high" },
  ];

  const categories = ["Фигурки", "Комиксы", "Манга", "Мерч", "Игры"];
  const universes = ["Marvel", "DC", "Anime", "Star Wars", "Games"];

  function toggleFilter(value, list, setList) {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  }

  function checkPrice(product) {
    if (selectedPrices.length === 0) return true;

    return selectedPrices.some((filter) => {
      if (filter === "low") return product.price < 1000;
      if (filter === "middle") return product.price >= 1000 && product.price <= 3000;
      if (filter === "high") return product.price > 3000;
      return true;
    });
  }

  const filteredProducts = allProducts.filter((product) => {
  const priceOk = checkPrice(product);

  const categoryOk =
    selectedCategories.length === 0 ||
    selectedCategories.includes(product.category);

  const universeOk =
    selectedUniverses.length === 0 ||
    selectedUniverses.includes(product.universe);

  return priceOk && categoryOk && universeOk;
});

const sortedProducts = [...filteredProducts].sort((a, b) => {
  if (sortType === "cheap") {
    return a.price - b.price;
  }

  if (sortType === "expensive") {
    return b.price - a.price;
  }

  return 0;
});

  function resetFilters() {
    setSelectedPrices([]);
    setSelectedCategories([]);
    setSelectedUniverses([]);
  }

  return (
    <main className="products-page">
      <h1>Все товары</h1>

      <div className="products-layout">
        <aside className="filters">
          <div className="filters-header">
            <h2>Фильтры</h2>
            <button onClick={resetFilters}>Сбросить</button>
          </div>

          <div className="filter-block">
            <h3>Цена</h3>

            {priceFilters.map((filter) => (
              <label className="checkbox-row" key={filter.value}>
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(filter.value)}
                  onChange={() =>
                    toggleFilter(filter.value, selectedPrices, setSelectedPrices)
                  }
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>

          <div className="filter-block">
            <h3>Категория</h3>

            {categories.map((category) => (
              <label className="checkbox-row" key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    toggleFilter(category, selectedCategories, setSelectedCategories)
                  }
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <div className="filter-block">
            <h3>Вселенная</h3>

            {universes.map((universe) => (
              <label className="checkbox-row" key={universe}>
                <input
                  type="checkbox"
                  checked={selectedUniverses.includes(universe)}
                  onChange={() =>
                    toggleFilter(universe, selectedUniverses, setSelectedUniverses)
                  }
                />
                <span>{universe}</span>
              </label>
            ))}
          </div>
        </aside>

        <section className="products-content">
          <div className="products-top">
            <p>Найдено товаров: {filteredProducts.length}</p>

            <select value={sortType} onChange={(event) => setSortType(event.target.value)}>
            <option value="default">Сортировка</option>
            <option value="cheap">Сначала дешёвые</option>
            <option value="expensive">Сначала дорогие</option>
            </select>

          </div>

          <div className="products-grid">
            {sortedProducts.map((product) => (
              <article className="shop-card" key={product.id}>
                <button
                  className={favorites.includes(product.id) ? "favorite-btn active" : "favorite-btn"}
                  onClick={() => {
                    if (!currentUser) {
                      alert("Добавлять товары в избранное можно только после регистрации или входа");
                      setPage("login");
                      return;
                  }

                  toggleFavorite(product.id);
                }}
                >
                {favorites.includes(product.id) ? "♥" : "♡"}
                </button>

                <div className="shop-image">IMG</div>

                <p className="shop-status">В наличии</p>

                <h3>{product.title}</h3>

                <p className="shop-meta">
                  {product.category} / {product.universe}
                </p>

                <div className="shop-bottom">
                  <strong>{product.price.toLocaleString("ru-RU")} ₽</strong>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert("Добавлять товары в корзину можно только после регистрации или входа");
                        setPage("login");
                        return;
                      }

                      addToCart(product.id);
                    }}
                  >
                    🛒 
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Footer({ setPage }) {
  function goToAbout(event) {
    event.preventDefault();

    setPage("home");

    setTimeout(() => {
      const aboutBlock = document.getElementById("about-project");

      if (aboutBlock) {
        aboutBlock.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  return (
    <footer className="site-footer">
      <div className="footer-logo-box">
        <img src={footerLogo} alt="FunUniverse logo" />
      </div>

      <div className="footer-info">
        <div className="footer-block">
          <h2>Соц-сети</h2>

          <div className="social-buttons">
            <a
              href="https://t.me/FunUniverseo3o"
              target="_blank"
              rel="noreferrer"
              className="social-btn tg"
            >
              Tg
            </a>

            <a
              href="https://vk.com/sndk_tv?ysclid=mqy5za2b3t428340004"
              target="_blank"
              rel="noreferrer"
              className="social-btn vk"
            >
              Vk
            </a>

            <a
              href="https://e.mail.ru/cgi-bin/sentmsg?To=milenamar@bk.ru&from=otvet"
              target="_blank"
              rel="noreferrer"
              className="social-btn mail"
            >
              @
            </a>
          </div>
        </div>

        <div className="footer-block">
  <h2>Контакты</h2>
  <p>+7 900 671 0138</p>
  <p>+7 929 306 2311</p>
  <p>+7 996 736 1775</p>
</div>

        <div className="footer-block">
          <h2>Часы работы</h2>
          <p>с 15:00 до 20:00</p>
        </div>

        <div className="footer-block">
          <h2>О проекте</h2>
          <a href="#about-project" onClick={goToAbout}>
            Зачем вообще был создан этот проект?
          </a>
        </div>
      </div>
    </footer>
  );
}

function FavoritesPage({ currentUser, favorites, toggleFavorite, setPage }) {
  const favoriteProducts = allProducts.filter((product) =>
    favorites.includes(product.id)
  );

  return (
    <main className="products-page favorites-page">
      <h1>Избранное</h1>

      {!currentUser && (
        <div className="empty-favorites">
          <p>Добавлять товары в избранное можно только после регистрации.</p>
          <button onClick={() => setPage("login")}>Войти / создать аккаунт</button>
        </div>
      )}

      {currentUser && favoriteProducts.length === 0 && (
        <div className="empty-favorites">
          <p>Вы пока не выбрали свои любимые товары :(</p>
          <button onClick={() => setPage("products")}>Перейти ко всем товарам</button>
        </div>
      )}

      {currentUser && favoriteProducts.length > 0 && (
        <div className="products-grid favorites-grid">
          {favoriteProducts.map((product) => (
            <article className="shop-card" key={product.id}>
              <button
                className="favorite-btn active"
                onClick={() => toggleFavorite(product.id)}
              >
                ♥
              </button>

              <div className="shop-image">IMG</div>

              <h3>{product.title}</h3>

              <div className="shop-bottom">
                <strong>{product.price.toLocaleString("ru-RU")} ₽</strong>
                <button>🛒</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function CartPage({
  currentUser,
  cart,
  changeCartQuantity,
  removeFromCart,
  setPage,
}) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const cartProducts = cart
    .map((cartItem) => {
      const product = allProducts.find((item) => item.id === cartItem.id);

      if (!product) {
        return null;
      }

      return {
        ...product,
        quantity: cartItem.quantity,
      };
    
    })
    .filter(Boolean);

  const subtotal = cartProducts.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  const promoDiscounts = {
    RETRO5: 0.05,
    RETRO10: 0.1,
    RETRO15: 0.15,
  };

const discount = appliedPromo
  ? subtotal * promoDiscounts[appliedPromo]
  : 0;
  const total = subtotal - discount;

  function applyPromo() {
  const normalizedPromo = promoCode.trim().toUpperCase();

  const promoDiscounts = {
    RETRO5: 0.05,
    RETRO10: 0.1,
    RETRO15: 0.15,
  };

  if (promoDiscounts[normalizedPromo]) {
    setAppliedPromo(normalizedPromo);
    setPromoMessage(
      `Промокод применён: скидка ${promoDiscounts[normalizedPromo] * 100}%`
    );
  } else {
    setAppliedPromo("");
    setPromoMessage("Такого промокода нет");
  }
}

  if (!currentUser) {
    return (
      <main className="cart-page">
        <h1>Корзина</h1>

        <div className="empty-cart">
          <img src={cartLogo} alt="Корзина" />
          <p>ваша корзина пока пуста</p>
          <button onClick={() => setPage("login")}>Войти / создать аккаунт</button>
        </div>
      </main>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <main className="cart-page">
        <h1>Корзина</h1>

        <div className="empty-cart">
          <img src={cartLogo} alt="Корзина" />
          <p>ваша корзина пока пуста</p>
          <button onClick={() => setPage("products")}>Перейти ко всем товарам</button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Корзина</h1>

      <div className="cart-layout">
        <section className="cart-items">
          {cartProducts.map((product) => (
            <article className="cart-item" key={product.id}>
              <div className="cart-item-image">IMG</div>

              <div className="cart-item-info">
                <h2>{product.title}</h2>
                <p>{product.price.toLocaleString("ru-RU")} ₽ / шт</p>
              </div>

              <div className="quantity-control">
                <button
                  onClick={() =>
                    changeCartQuantity(product.id, product.quantity - 1)
                  }
                >
                  −
                </button>

                <span>{product.quantity}</span>

                <button
                  onClick={() =>
                    changeCartQuantity(product.id, product.quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <strong className="cart-item-total">
                {(product.price * product.quantity).toLocaleString("ru-RU")} ₽
              </strong>

              <button
                className="cart-delete"
                onClick={() => removeFromCart(product.id)}
              >
                🗑
              </button>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <img className="cart-summary-logo" src={cartLogo} alt="FunUniverse" />

          <div className="promo-box">
            <h2>Промокод</h2>

            <div className="promo-row">
              <input
                type="text"
                placeholder="Введите промокод"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
              />

              <button onClick={applyPromo}>✓</button>
            </div>

            {promoMessage && <p>{promoMessage}</p>}
          </div>

          <div className="delivery-box">
            <h2>Бесплатная доставка</h2>

            <p>
              Заполняйте корзину товарами, и бесплатная доставка будет
              автоматически включена!
            </p>

            <ul>
              <li>
                При заказе от 1000 ₽: Бесплатная доставка почтой России в Москву
              </li>
              <li>
                При заказе от 3000 ₽: Бесплатная доставка почтой России в ближние
                регионы
              </li>
              <li>
                При заказе от 5000 ₽: Бесплатная доставка в Магаданскую, Амурскую,
                Иркутскую области, Хабаровский, Приморский, Забайкальский,
                Камчатский край, Якутию, Бурятию, Еврейский АО, Чукотский АО
              </li>
            </ul>
          </div>

          <div className="total-box">
            <p>Сумма товаров: {subtotal.toLocaleString("ru-RU")} ₽</p>

            {appliedPromo && (
              <p>Скидка: −{discount.toLocaleString("ru-RU")} ₽</p>
            )}

            <h2>Итого: {total.toLocaleString("ru-RU")} ₽</h2>

            <button>Оформить заказ</button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function UniversesPage({ setPage, setSelectedUniverseFromPage }) {
  const universesList = [
    {
      title: "Marvel",
      value: "Marvel",
      image: marvelLogo,
    },
    {
      title: "Star Wars",
      value: "Star Wars",
      image: starWarsLogo,
    },
    {
      title: "DC",
      value: "DC",
      image: dcLogo,
    },
    {
      title: "Anime",
      value: "Anime",
      image: animeLogo,
    },
    {
      title: "Games",
      value: "Games",
      image: gamesLogo,
    },
  ];

  function openUniverse(universe) {
    setSelectedUniverseFromPage(universe);
    setPage("products");
  }

  return (
    <main className="universes-page">
      <h1>Выбери свою вселенную</h1>

      <p className="universes-text">
        Нажми на логотип, чтобы увидеть товары из выбранной вселенной
      </p>

      <div className="universes-grid">
        {universesList.map((universe) => (
          <button
            className="universe-card"
            key={universe.value}
            onClick={() => openUniverse(universe.value)}
          >
            <img src={universe.image} alt={universe.title} />
            <span>{universe.title}</span>
          </button>
        ))}
      </div>
    </main>
  );
}

function AboutPage() {
  const team = [
    {
      name: "DAYESA012",
      text: "Отвечаем за то, чтобы сайт выглядел так, будто его нашли в заброшенной аркаде 90-х...",
      avatar: "🧑‍💻",
    },
    {
      name: "NONAMMM01",
      text: "Колдуем над багами и делаем так, чтобы динозаврик бегал, а сайт работал без перебоев в ваше удовольствие.",
      avatar: "🧙‍♀️",
    },
    {
      name: "KKSE311",
      text: "Знаем, где находится та самая пасхалка в «очень странных делах», и следим за качеством принтов и оригинальностью.",
      avatar: "🧝",
    },
  ];

  const stats = [
    { title: "Сила", value: 87, className: "green" },
    { title: "Ловкость", value: 64, className: "cyan" },
    { title: "Интеллект", value: 72, className: "yellow" },
    { title: "Выносливость", value: 58, className: "pink" },
    { title: "Удача", value: 91, className: "purple" },
  ];

  const achievements = [
    {
      icon: "◉",
      title: "Первый раз",
      text: "Впервые посетил наш сайт",
      unlocked: true,
    },
    {
      icon: "▣",
      title: "Знаток",
      text: "Нашёл страницу «О нас»",
      unlocked: true,
    },
    {
      icon: "☆",
      title: "Звезда",
      text: "Провёл на сайте больше минуты",
      unlocked: true,
    },
    {
      icon: "🔒",
      title: "Сокровище",
      text: "???",
      unlocked: false,
    },
    {
      icon: "🎮",
      title: "Непробиваемый",
      text: "???",
      unlocked: false,
    },
    {
      icon: "☆",
      title: "Легенда",
      text: "???",
      unlocked: false,
    },
  ];

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-glow about-glow-one"></div>
        <div className="about-glow about-glow-two"></div>

        <h1>ВНИМАНИЕ! Инфа о нас!</h1>

        <p>
          Привет, путешественник по вселенным! Добро пожаловать в{" "}
          <b>Fun Universe</b> — это место, где поп-культура встречается с
          пиксельным прошлым.
        </p>

        <p>
          Мы — простые человека, которые устали искать мерч по различным
          мульти-вселенным, и хотим, чтоб каждый без труда мог получить крутой
          мерч. Мы взяли старые аркадные автоматы, смешали их с любовью к кино,
          аниме и играм, и создали это уютное место, которое примет любого
          независимо от его любимой вселенной.
        </p>
      </section>

      <section className="about-team">
        {team.map((person) => (
          <article className="team-card" key={person.name}>
            <div className="team-avatar">{person.avatar}</div>
            <h2>{person.name}</h2>
            <p>{person.text}<span className="terminal-cursor">█</span></p>
          </article>
        ))}
      </section>

      <section className="about-project-info">
        <div className="about-glow about-glow-three"></div>
        <div className="about-glow about-glow-four"></div>

        <p>
          <b>Fun Universe</b> — это студенческий e-commerce проект,
          специализирующийся на продаже тематического мерча по популярным
          вселенным: кино, игры, аниме.
        </p>

        <p>
          Платформа представляет собой интернет-магазин с уникальной концепцией:
          ретро-аркадный стиль оформления, дополненный игровыми механиками для
          повышения вовлеченности пользователей. Проект реализован командой из
          трёх разработчиков в рамках учебной деятельности.
        </p>

        <p>
          <b>Целевая аудитория:</b> молодые люди от 16 до 30 лет, фанаты
          поп-культуры, гик-сообщества.
          <br />
          <b>Цель проекта:</b> создание функционального и эстетически
          привлекательного маркетплейса с высоким уровнем пользовательского
          вовлечения.
        </p>
      </section>

      <section className="about-character">
        <div className="mascot-box">
          <img src={aboutMascot} alt="Наш маскот" />
          <span>НАШ МАСКОТ</span>
        </div>

        <div className="stats-panel">
          <h2>▣ Характеристики</h2>

          {stats.map((stat) => (
            <div className="stat-row" key={stat.title}>
              <div className="stat-top">
                <span>{stat.title}</span>
                <span>{stat.value}</span>
              </div>

              <div className="stat-line">
                <div
                  className={`stat-fill ${stat.className}`}
                  style={{ width: `${stat.value}%` }}
                ></div>
              </div>
            </div>
          ))}

          <div className="special-box">
            <h3>★ Особенность</h3>
            <p>
              «Misk» — в темноте все характеристики увеличиваются на 20%.
              Находить коллекционки без усилий | Никогда не проигрывать в
              аркадные игры.
            </p>
          </div>
        </div>
      </section>

      <section className="about-achievements">
        <h2>Достижения</h2>

        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <article
              className={
                achievement.unlocked
                  ? "achievement-card unlocked"
                  : "achievement-card locked"
              }
              key={achievement.title}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <h3>{achievement.title}</h3>
              <p>{achievement.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProfilePage({
  currentUser,
  setCurrentUser,
  favorites,
  cart,
  setPage,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(currentUser?.nickname || "");
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");
  const [message, setMessage] = useState("");

  if (!currentUser) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <h1>Личный кабинет</h1>
          <p>Войдите или создайте аккаунт, чтобы открыть личный кабинет.</p>
          <button onClick={() => setPage("login")}>Войти</button>
        </section>
      </main>
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("ru-RU");
  }

function handleAvatarChange(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    alert("Файл слишком большой");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    setAvatarPreview(reader.result);
  };

  reader.readAsDataURL(file);
}

async function saveProfile() {
  if (!currentUser || !currentUser.id) {
    setMessage("Пользователь не авторизован");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3001/api/profile/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          avatar: avatarPreview,
        }),
      }
    );

    const data = await response.json();

    setMessage(data.message);

    if (data.success) {
      setCurrentUser(data.user);
      setIsEditing(false);
    }
  } catch {
    setMessage("Ошибка соединения с сервером");
  }
}

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-title-row">
          <h1>Личный кабинет</h1>

          <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>
            ✎
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-block">
            <div className="profile-avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Аватар" />
              ) : (
                <span>
                  {(currentUser.nickname || currentUser.login || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {isEditing && (
              <label className="avatar-upload">
                Загрузить аватар
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-row">
              <span>Никнейм:</span>

              {isEditing ? (
                <input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                />
              ) : (
                <b>{currentUser.nickname}</b>
              )}
            </div>

            <div className="profile-row">
              <span>ID пользователя:</span>
              <b>#{currentUser.id}</b>
            </div>

            <div className="profile-row">
              <span>Почта:</span>
              <b>{currentUser.email || "не указана"}</b>
            </div>

            <div className="profile-row">
              <span>Дата регистрации:</span>
              <b>{formatDate(currentUser.registeredAt)}</b>
            </div>

            <div className="profile-row">
              <span>Избранных товаров:</span>
              <b>{favorites.length}</b>
            </div>

            <div className="profile-row">
              <span>Товаров в корзине:</span>
              <b>{cartCount}</b>
            </div>

            {isEditing && (
              <button className="save-profile-btn" onClick={saveProfile}>
                Сохранить
              </button>
            )}

            {message && <p className="profile-message">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

function CasinoPage({ currentUser }) {
  const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎"];

  const prizes = [
    { discount: 5, code: "RETRO5", weight: 50 },
    { discount: 10, code: "RETRO10", weight: 30 },
    { discount: 15, code: "RETRO15", weight: 20 },
  ];

  const maxAttemptsPerDay = 3;
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `casino-attempts-${currentUser?.id || "guest"}`;

  function getSavedAttempts() {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      return { date: today, used: 0 };
    }

    const data = JSON.parse(saved);

    if (data.date !== today) {
      return { date: today, used: 0 };
    }

    return data;
  }

  const savedAttempts = getSavedAttempts();

  const [drums, setDrums] = useState(["⭐", "⭐", "⭐"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [usedAttempts, setUsedAttempts] = useState(savedAttempts.used);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPrize, setCurrentPrize] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");

  const attemptsLeft = maxAttemptsPerDay - usedAttempts;

  function saveAttempts(newUsedAttempts) {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        date: today,
        used: newUsedAttempts,
      })
    );
  }

  function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function choosePrize() {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;

    for (const prize of prizes) {
      random -= prize.weight;

      if (random <= 0) {
        return prize;
      }
    }

    return prizes[0];
  }

  function makeLoseResult() {
    const first = getRandomSymbol();
    let second = getRandomSymbol();

    while (second === first) {
      second = getRandomSymbol();
    }

    const third = Math.random() < 0.5 ? first : second;

    return [first, second, third];
  }

  function spin() {
    if (isSpinning) return;

    if (attemptsLeft <= 0) {
      alert("Попытки на сегодня закончились. Возвращайся завтра!");
      return;
    }

    const newUsedAttempts = usedAttempts + 1;
    setUsedAttempts(newUsedAttempts);
    saveAttempts(newUsedAttempts);

    setIsSpinning(true);
    setCopyMessage("");
    setModalOpen(false);

    const willWin = Math.random() < 0.25;
    const prize = willWin ? choosePrize() : null;
    const winSymbol = willWin ? getRandomSymbol() : null;
    const finalResult = willWin
      ? [winSymbol, winSymbol, winSymbol]
      : makeLoseResult();

    let counter = 0;

    const interval = setInterval(() => {
      setDrums([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      counter += 1;

      if (counter >= 18) {
        clearInterval(interval);
        setDrums(finalResult);
        setIsSpinning(false);

        if (willWin) {
          setCurrentPrize(prize);

          setTimeout(() => {
            setModalOpen(true);
          }, 450);
        }
      }
    }, 90);
  }

  async function copyCode() {
    if (!currentPrize) return;

    try {
      await navigator.clipboard.writeText(currentPrize.code);
      setCopyMessage("✓ Код скопирован!");
    } catch {
      setCopyMessage("Код: " + currentPrize.code);
    }
  }

  return (
    <main className="casino-page">
      <section className="casino-container">
        <h1 className="casino-title">🎰 SPIN TO WIN 🎰</h1>

        <p className="casino-subtitle">
          Собери три одинаковых символа и получи промокод!
        </p>

        <div className="casino-machine">
          <div className="casino-drums">
            {drums.map((symbol, index) => (
              <div className="casino-drum" key={index}>
                <div
                  className={
                    isSpinning
                      ? "casino-drum-inner spinning"
                      : "casino-drum-inner"
                  }
                >
                  {symbol}
                </div>
              </div>
            ))}
          </div>

          <button
            className="casino-spin-btn"
            onClick={spin}
            disabled={isSpinning || attemptsLeft <= 0}
          >
            {isSpinning ? "SPINNING..." : "SPIN!"}
          </button>

          <div className="casino-attempts">
            Осталось попыток: <b>{attemptsLeft}</b> / {maxAttemptsPerDay}
          </div>
        </div>
      </section>

      {modalOpen && currentPrize && (
        <div className="casino-modal" onClick={() => setModalOpen(false)}>
          <div
            className="casino-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>🎉 YOU WIN! 🎉</h2>

            <p>Ты выиграла скидку {currentPrize.discount}%!</p>

            <div className="casino-promo-code">{currentPrize.code}</div>

            <div className="casino-modal-buttons">
              <button onClick={copyCode}>📋 COPY CODE</button>
              <button onClick={() => setModalOpen(false)}>✕ CLOSE</button>
            </div>

            {copyMessage && <p className="casino-copy-message">{copyMessage}</p>}
          </div>
        </div>
      )}
    </main>
  );
}

function App() {
  
  const [page, setPage] = useState("home");
  const [selectedUniverseFromPage, setSelectedUniverseFromPage] = useState("");
  const [selectedCategoryFromHome,setSelectedCategoryFromHome] = useState("");
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  }

  function addToCart(productId) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find((item) => item.id === productId);

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { id: productId, quantity: 1 }];
    });
  }

  function changeCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== productId)
      );
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  return (
    <div className="app">
      <Header setPage={setPage} currentUser={currentUser} />

      {page === "home" && (
  <HomePage
    setPage={setPage}
    setSelectedCategoryFromHome={setSelectedCategoryFromHome}
  />
)}

      {page === "casino" && <CasinoPage currentUser={currentUser} />}

      {page === "products" && (
      <ProductsPage
        currentUser={currentUser}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        setPage={setPage}
        addToCart={addToCart}

        selectedUniverseFromPage={selectedUniverseFromPage}
        setSelectedUniverseFromPage={setSelectedUniverseFromPage}

        selectedCategoryFromHome={selectedCategoryFromHome}
        setSelectedCategoryFromHome={setSelectedCategoryFromHome}
      />
    )}

      {page === "universes" && (
        <UniversesPage
          setPage={setPage}
          setSelectedUniverseFromPage={setSelectedUniverseFromPage}
        />
      )}

      {page === "about" && <AboutPage />}

      {page === "favorites" && (
        <FavoritesPage
          currentUser={currentUser}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setPage={setPage}
        />
      )}

      {page === "cart" && (
        <CartPage
          currentUser={currentUser}
          cart={cart}
          changeCartQuantity={changeCartQuantity}
          removeFromCart={removeFromCart}
          setPage={setPage}
        />
      )}

      {page === "login" && (
        <LoginPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
      )}

      {page === "profile" && (
        <ProfilePage
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          favorites={favorites}
          cart={cart}
          setPage={setPage}
        />
      )}

      <Footer setPage={setPage} />
    </div>
  );
}

export default App;
