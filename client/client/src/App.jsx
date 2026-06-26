import { useEffect, useRef, useState } from "react";
import "./App.css";

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

function Header({ setPage }) {
  return (
    <header className="site-header">
      <button className="logo" onClick={() => setPage("home")}>
        ?
      </button>

      <nav className="main-nav">
        <button onClick={() => setPage("home")}>Главная</button>
        <button onClick={() => setPage("products")}>Все товары</button>
        <button onClick={() => setPage("universes")}>Выбери свою вселенную</button>
      </nav>

      <div className="header-actions">
        <button onClick={() => setPage("favorites")}>♡</button>
        <button onClick={() => setPage("cart")}>⌑</button>
        <button className="login-btn" onClick={() => setPage("login")}>
          ➜ Вход
        </button>
      </div>
    </header>
  );
}

function HomePage() {
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

  return (
    <main className="home">
      <section className="products-section mario-bg">
        <div className="top-row">
          <div className="small-photo-placeholder">IMG</div>

          <button
            className="catalog-btn"
            onMouseEnter={() => setCatalogOpen(true)}
            onClick={() => setCatalogOpen((value) => !value)}
          >
            Каталог
          </button>
        </div>

        {catalogOpen && (
          <aside
            className="catalog-panel"
            onMouseLeave={() => setCatalogOpen(false)}
          >
            <h3>Каталог</h3>
            <p>Заглушка бокового каталога.</p>
            <button>Фигурки</button>
            <button>Комиксы</button>
            <button>Манга</button>
            <button>Игры</button>
            <button>Мерч</button>
          </aside>
        )}

        <h2 className="section-title">Новинки</h2>

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

      <section className="about-section">
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

      <section className="contacts-section">
        <h2>Наши Контакты</h2>
        <p className="contacts-subtitle">
          Заказы не принимаем. Кидайте товар в корзину и платите нам деньги :)
        </p>

        <div className="contacts-grid">
          <div className="contact-card">
            <div className="contact-icon">☎</div>
            <h3>Контакты</h3>
            <p>+1900-611-01-38</p>
            <p>WearetheDuriki@company.com</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">◷</div>
            <h3>Время работы</h3>
            <p>Никогда</p>
            <p>с 15:00 до 20:00</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">⌖</div>
            <h3>Адрес</h3>
            <p>Пилотов, 28.</p>
            <p>лучше не входить...</p>
          </div>
        </div>
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

function LoginPage() {
  const [mode, setMode] = useState("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

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
    setCurrentUser("");
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
              Вы вошли как: <b>{currentUser}</b>
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
                placeholder="Придумайте логин"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
              />

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

function ProductsPage() {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUniverses, setSelectedUniverses] = useState([]);
  const [sortType, setSortType] = useState("default");

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
                <button className="favorite-btn">♡</button>

                <div className="shop-image">IMG</div>

                <p className="shop-status">В наличии</p>

                <h3>{product.title}</h3>

                <p className="shop-meta">
                  {product.category} / {product.universe}
                </p>

                <div className="shop-bottom">
                  <strong>{product.price.toLocaleString("ru-RU")} ₽</strong>
                  <button>🛒</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <Header setPage={setPage} />

      {page === "home" && <HomePage />}
      {page === "products" && <ProductsPage />}
      {page === "universes" && <StubPage title="Выбери свою вселенную" />}
      {page === "favorites" && <StubPage title="Избранное" />}
      {page === "cart" && <StubPage title="Корзина" />}
      {page === "login" && <LoginPage />}
    </div>
  );
}

export default App;
