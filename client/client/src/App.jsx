import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
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
import ProductCard from "./components/ProductCard";

function Header({ setPage, currentUser }) {
  const { t, i18n } = useTranslation();

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  }

  return (
    <header className="site-header">
      <button className="logo" onClick={() => setPage("casino")}>
        ?
      </button>

      <nav className="main-nav">
        <button onClick={() => setPage("home")}>{t('header.home')}</button>
        <button onClick={() => setPage("products")}>{t('header.products')}</button>
        <button onClick={() => setPage("universes")}>{t('header.universes')}</button>
        <button onClick={() => setPage("about")}>{t('header.about')}</button>
        <button onClick={() => setPage("admin")}>{t('header.admin')}</button>
      </nav>

      <div className="header-actions">
        <div className="language-switcher">
          <button 
            onClick={() => changeLanguage('ru')}
            className={i18n.language === 'ru' ? 'active-lang' : ''}
          >
            🇷🇺
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            className={i18n.language === 'en' ? 'active-lang' : ''}
          >
            🇬🇧
          </button>
        </div>

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
            ➜ {t('header.login')}
          </button>
        )}
      </div>
    </header>
  );
}

function HomePage({
  setPage,
  setSelectedCategoryFromHome,
  addToCart,
  allProducts,
  currentUser,
  favorites,
  toggleFavorite,
}) {
  const { t } = useTranslation();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [notification, setNotification] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const newProducts = allProducts.filter(product => product.isNew === true);
  const visibleProducts = newProducts.length > 0 ? newProducts.slice(slide, slide + 5) : [];

  function nextSlide() {
    if (newProducts.length === 0) return;
    setSlide((current) => {
      if (current + 5 >= newProducts.length) return 0;
      return current + 1;
    });
  }

  function prevSlide() {
    if (newProducts.length === 0) return;
    setSlide((current) => {
      if (current === 0) return Math.max(newProducts.length - 5, 0);
      return current - 1;
    });
  }

  function openCategory(category) {
    setSelectedCategoryFromHome(category);
    setCatalogOpen(false);
    setPage("products");
  }

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  }

  function openProduct(product) {
    setSelectedProduct(product);
  }

  function closeProduct() {
    setSelectedProduct(null);
  }

  function handleAddToCart(productId) {
    if (!currentUser) {
      showNotification(t('notifications.loginRequired'), "error");
      setTimeout(() => setPage("login"), 1500);
      return;
    }
    addToCart(productId);
    const product = allProducts.find(p => p.id === productId);
    showNotification(t('notifications.addedToCart', { title: product?.title || "Товар" }), "success");
  }

  function handleToggleFavorite(productId) {
    if (!currentUser) {
      showNotification(t('notifications.favoriteLoginRequired'), "error");
      setTimeout(() => setPage("login"), 1500);
      return;
    }
    const isFavorite = favorites.includes(productId);
    toggleFavorite(productId);
    const product = allProducts.find(p => p.id === productId);
    showNotification(
      isFavorite 
        ? t('notifications.removedFromFavorites', { title: product?.title || "Товар" })
        : t('notifications.addedToFavorites', { title: product?.title || "Товар" }),
      "success"
    );
  }

  return (
    <main className="home">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <section className="products-section mario-bg">
        <div className="top-row">
          <div className="small-photo-placeholder">
            <img src={mainLogo} alt="FunUniverse" />
          </div>
        </div>

        {catalogOpen && (
          <aside className="catalog-panel" onMouseLeave={() => setCatalogOpen(false)}>
            <h3>{t('home.catalog')}</h3>
            <button onClick={() => openCategory("Фигурки")}>{t('home.categories.figurines')}</button>
            <button onClick={() => openCategory("Комиксы")}>{t('home.categories.comics')}</button>
            <button onClick={() => openCategory("Манга")}>{t('home.categories.manga')}</button>
            <button onClick={() => openCategory("Игры")}>{t('home.categories.games')}</button>
          </aside>
        )}

        <div className="section-heading-row">
          <h2 className="section-title">{t('home.new')}</h2>
          <button
            className="catalog-btn"
            onMouseEnter={() => setCatalogOpen(true)}
            onClick={() => setCatalogOpen((value) => !value)}
          >
            {t('home.catalog')}
          </button>
        </div>

        <div className="slider">
          {newProducts.length > 0 ? (
            <>
              <button className="slider-arrow left" onClick={prevSlide}>←</button>
              <div className="product-list">
                {visibleProducts.map((product, index) => (
                  <article className="product-card" key={`${product.id}-${index}`}>
                    <button
                      className={`favorite-btn ${favorites.includes(product.id) ? "active" : ""}`}
                      onClick={() => handleToggleFavorite(product.id)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        zIndex: "3",
                        border: "none",
                        background: "transparent",
                        color: favorites.includes(product.id) ? "#ff3b8d" : "#ffffff",
                        fontSize: "24px",
                        cursor: "pointer",
                        textShadow: favorites.includes(product.id) 
                          ? "2px 2px 0 #000, 0 0 12px #ff3b8d" 
                          : "0 0 8px #8b2cff",
                        width: "36px",
                        height: "36px",
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      {favorites.includes(product.id) ? "♥" : "♡"}
                    </button>
                    <div className="product-image" onClick={() => openProduct(product)} style={{ cursor: 'pointer' }}>
                      IMG
                    </div>
                    <p className="product-desc" onClick={() => openProduct(product)} style={{ cursor: 'pointer' }}>
                      {product.title}
                    </p>
                    <p className="product-price">{product.price.toLocaleString("ru-RU")} ₽</p>
                    <button className="cart-btn" onClick={() => handleAddToCart(product.id)}>
                      🛒
                    </button>
                  </article>
                ))}
              </div>
              <button className="slider-arrow right" onClick={nextSlide}>→</button>
            </>
          ) : null}
        </div>

        <div className="pixel-bg-placeholder"></div>
      </section>

      <DinoRunner />

      <section className="about-section" id="about-project">
        <h2>{t('home.about.title')}</h2>
        <p>{t('home.about.text')}</p>
      </section>

      {selectedProduct && (
        <ProductCard
          product={selectedProduct}
          onClose={closeProduct}
          currentUser={currentUser}
          addToCart={addToCart}
          toggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      )}
    </main>
  );
}

function DinoRunner() {
  const { t } = useTranslation();
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

    let dino, obstacles, gameState, score, hiScore, gameSpeed, frameCount, groundOffset, animationId;

    function initGame() {
      dino = { x: 70, y: GROUND_Y, w: 42, h: 46, vy: 0, grounded: true };
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
      if (gameState === "idle") { startGame(); return; }
      if (gameState === "over") { resetGame(); return; }
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
      const x = dino.x, y = dino.y, px = 4;
      rect(x, y, 8*px, 8*px, "#58a6ff");
      rect(x + 8*px, y - 2*px, 4*px, 4*px, "#58a6ff");
      rect(x + 10*px, y - 4*px, 4*px, 3*px, "#58a6ff");
      rect(x + 12*px, y - 3*px, 2*px, 2*px, "#ffffff");
      rect(x - 3*px, y + 2*px, 3*px, 2*px, "#58a6ff");
      rect(x + 2*px, y + 2*px, 5*px, 4*px, "#79c0ff");
      rect(x + 1*px, y + 8*px, 3*px, 4*px, "#3d7abf");
      rect(x + 5*px, y + 8*px, 3*px, 3*px, "#3d7abf");
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
      obstacles.push({ x: GAME_W, y: GROUND_Y + dino.h + 4, w: 22, h: 34 + Math.floor(Math.random() * 24) });
    }

    function collision(a, b) {
      return a.x + 6 < b.x + b.w && a.x + a.w - 6 > b.x && a.y + 8 < b.y && a.y + a.h > b.y - b.h;
    }

    function update() {
      if (gameState !== "playing") return;
      frameCount += 1;
      score += gameSpeed * 0.02;
      updateScore();
      if (frameCount % 220 === 0) gameSpeed = Math.min(gameSpeed + 0.4, 13);
      if (!dino.grounded) {
        dino.vy += GRAVITY;
        dino.y += dino.vy;
        if (dino.y >= GROUND_Y) { dino.y = GROUND_Y; dino.vy = 0; dino.grounded = true; }
      }
      groundOffset = (groundOffset + gameSpeed) % GAME_W;
      const last = obstacles[obstacles.length - 1];
      if (!last || last.x < GAME_W - 260 - Math.random() * 120) spawnObstacle();
      obstacles.forEach(obstacle => obstacle.x -= gameSpeed);
      obstacles = obstacles.filter(obstacle => obstacle.x > -50);
      for (const obstacle of obstacles) {
        if (collision(dino, obstacle)) { endGame(); break; }
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
        <p className="dino-label">{t('home.dino.title')}</p>
        <h2>{t('home.dino.subtitle')}</h2>
        <p className="dino-hint">{t('home.dino.hint')}</p>
        <div className="dino-game">
          <canvas ref={canvasRef} width="800" height="250"></canvas>
          <div ref={overlayRef} className="dino-overlay">
            <div>
              <h3>{t('home.dino.title')}</h3>
              <p>{t('home.dino.start')}</p>
            </div>
          </div>
          <div ref={gameOverRef} className="dino-overlay game-over">
            <div>
              <h3>{t('home.dino.gameOver')}</h3>
              <p>{t('home.dino.score')}: <span ref={finalScoreRef}>0</span></p>
              <p>{t('home.dino.restart')}</p>
            </div>
          </div>
          <div className="score">
            {t('home.dino.score')} <span ref={scoreRef}>00000</span> {t('home.dino.hi')}{" "}
            <span ref={hiScoreRef}>00000</span>
          </div>
        </div>
        <button className="space-btn">SPACE</button>
      </div>
    </section>
  );
}

function LoginPage({ currentUser, setCurrentUser }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("login");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function sendAuthRequest(event) {
    event.preventDefault();
    const url = mode === "login" ? "http://localhost:3001/api/login" : "http://localhost:3001/api/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password, email }),
      });
      const data = await response.json();
      setMessage(data.message);
      setSuccess(data.success);
      if (data.success && mode === "login") {
        // Убеждаемся, что favorites загружены
        const userWithFavorites = {
          ...data.user,
          favorites: data.user.favorites || []
        };
        setCurrentUser(userWithFavorites);
        // Сохраняем favorites в localStorage для быстрого доступа
        localStorage.setItem('favorites', JSON.stringify(userWithFavorites.favorites || []));
      }
      if (data.success && mode === "register") {
        setMode("login");
        setPassword("");
        setMessage(t('login.registerSuccess'));
        setSuccess(true);
      }
    } catch (error) {
      setMessage("Ошибка соединения с сервером");
      setSuccess(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>{mode === "login" ? t('login.title') : t('login.register')}</h1>
        {currentUser ? (
          <div className="profile-box">
            <p>{t('login.alreadyLogged')} <b>{currentUser.nickname || currentUser.login}</b></p>
            <p>{t('login.logoutHint')}</p>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setMessage(""); }}>
                {t('login.loginTab')}
              </button>
              <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setMessage(""); }}>
                {t('login.registerTab')}
              </button>
            </div>
            <form onSubmit={sendAuthRequest} className="login-form">
              <input
                type="text"
                placeholder={mode === "login" ? t('login.loginPlaceholder') : t('login.registerPlaceholder')}
                value={login}
                onChange={(event) => setLogin(event.target.value)}
              />
              {mode === "register" && (
                <input
                  type="email"
                  placeholder={t('login.email')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              )}
              <input
                type="password"
                placeholder={t('login.password')}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button type="submit">
                {mode === "login" ? t('login.loginBtn') : t('login.registerBtn')}
              </button>
            </form>
          </>
        )}
        {message && (
          <p className={success ? "login-message success" : "login-message error"}>{message}</p>
        )}
      </section>
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
  allProducts,
}) {
  const { t } = useTranslation();
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUniverses, setSelectedUniverses] = useState([]);
  const [notification, setNotification] = useState(null);
  const [sortType, setSortType] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (selectedUniverseFromPage) {
      setSelectedUniverses([selectedUniverseFromPage]);
      setSelectedUniverseFromPage("");
    }
  }, [selectedUniverseFromPage, setSelectedUniverseFromPage]);

  useEffect(() => {
    if (selectedCategoryFromHome) {
      setSelectedCategories([selectedCategoryFromHome]);
      setSelectedCategoryFromHome("");
    }
  }, [selectedCategoryFromHome, setSelectedCategoryFromHome]);

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  }

  function openProduct(product) {
    setSelectedProduct(product);
  }

  function closeProduct() {
    setSelectedProduct(null);
  }

  const priceFilters = [
    { label: t('products.filters.priceLow'), value: "low" },
    { label: t('products.filters.priceMiddle'), value: "middle" },
    { label: t('products.filters.priceHigh'), value: "high" },
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
    const categoryOk = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const universeOk = selectedUniverses.length === 0 || selectedUniverses.includes(product.universe);
    return priceOk && categoryOk && universeOk;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === "cheap") return a.price - b.price;
    if (sortType === "expensive") return b.price - a.price;
    return 0;
  });

  function resetFilters() {
    setSelectedPrices([]);
    setSelectedCategories([]);
    setSelectedUniverses([]);
  }

  return (
    <main className="products-page">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1>{t('products.title')}</h1>

      <div className="products-layout">
        <aside className="filters">
          <div className="filters-header">
            <h2>{t('products.filters.title')}</h2>
            <button onClick={resetFilters}>{t('products.filters.reset')}</button>
          </div>

          <div className="filter-block">
            <h3>{t('products.filters.price')}</h3>
            {priceFilters.map((filter) => (
              <label className="checkbox-row" key={filter.value}>
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(filter.value)}
                  onChange={() => toggleFilter(filter.value, selectedPrices, setSelectedPrices)}
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>

          <div className="filter-block">
            <h3>{t('products.filters.category')}</h3>
            {categories.map((category) => (
              <label className="checkbox-row" key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <div className="filter-block">
            <h3>{t('products.filters.universe')}</h3>
            {universes.map((universe) => (
              <label className="checkbox-row" key={universe}>
                <input
                  type="checkbox"
                  checked={selectedUniverses.includes(universe)}
                  onChange={() => toggleFilter(universe, selectedUniverses, setSelectedUniverses)}
                />
                <span>{universe}</span>
              </label>
            ))}
          </div>
        </aside>

        <section className="products-content">
          <div className="products-top">
            <p>{t('products.found')} {filteredProducts.length}</p>
            <select value={sortType} onChange={(event) => setSortType(event.target.value)}>
              <option value="default">{t('products.sortDefault')}</option>
              <option value="cheap">{t('products.sortCheap')}</option>
              <option value="expensive">{t('products.sortExpensive')}</option>
            </select>
          </div>

          <div className="products-grid">
            {sortedProducts.map((product) => (
              <article className="shop-card" key={product.id}>
                <button
                  className={favorites.includes(product.id) ? "favorite-btn active" : "favorite-btn"}
                  onClick={() => {
                    if (!currentUser) {
                      showNotification(t('notifications.favoriteLoginRequired'), "error");
                      setTimeout(() => setPage("login"), 1500);
                      return;
                    }
                    const isFavorite = favorites.includes(product.id);
                    toggleFavorite(product.id);
                    showNotification(
                      isFavorite 
                        ? t('notifications.removedFromFavorites', { title: product.title })
                        : t('notifications.addedToFavorites', { title: product.title }),
                      "success"
                    );
                  }}
                >
                  {favorites.includes(product.id) ? "♥" : "♡"}
                </button>

                <div className="shop-image" onClick={() => openProduct(product)} style={{ cursor: 'pointer' }}>
                  IMG
                </div>
                <p className="shop-status">{t('products.inStock')}</p>
                <h3 onClick={() => openProduct(product)} style={{ cursor: 'pointer' }}>{product.title}</h3>
                <p className="shop-meta">{product.category} / {product.universe}</p>

                <div className="shop-bottom">
                  <strong>{product.price.toLocaleString("ru-RU")} ₽</strong>
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        showNotification(t('notifications.loginRequired'), "error");
                        setTimeout(() => setPage("login"), 1500);
                        return;
                      }
                      addToCart(product.id);
                      showNotification(t('notifications.addedToCart', { title: product.title }), "success");
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

      {selectedProduct && (
        <ProductCard
          product={selectedProduct}
          onClose={closeProduct}
          currentUser={currentUser}
          addToCart={addToCart}
          toggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      )}
    </main>
  );
}

function Footer({ setPage }) {
  const { t } = useTranslation();

  function goToAbout(event) {
    event.preventDefault();
    setPage("home");
    setTimeout(() => {
      const aboutBlock = document.getElementById("about-project");
      if (aboutBlock) {
        aboutBlock.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <h2>{t('footer.social')}</h2>
          <div className="social-buttons">
            <a href="https://t.me/FunUniverseo3o" target="_blank" rel="noreferrer" className="social-btn tg">Tg</a>
            <a href="https://vk.com/sndk_tv?ysclid=mqy5za2b3t428340004" target="_blank" rel="noreferrer" className="social-btn vk">Vk</a>
            <a href="https://e.mail.ru/cgi-bin/sentmsg?To=milenamar@bk.ru&from=otvet" target="_blank" rel="noreferrer" className="social-btn mail">@</a>
          </div>
        </div>

        <div className="footer-block">
          <h2>{t('footer.contacts')}</h2>
          <p>+7 900 671 0138</p>
          <p>+7 929 306 2311</p>
          <p>+7 996 736 1775</p>
        </div>

        <div className="footer-block">
          <h2>{t('footer.hours')}</h2>
          <p>{t('footer.hoursText')}</p>
        </div>

        <div className="footer-block">
          <h2>{t('footer.aboutProject')}</h2>
          <a href="#about-project" onClick={goToAbout}>{t('footer.aboutLink')}</a>
        </div>
      </div>
    </footer>
  );
}

function FavoritesPage({
  currentUser,
  favorites,
  toggleFavorite,
  setPage,
  allProducts,
}) {
  const { t } = useTranslation();
  const favoriteProducts = allProducts.filter((product) => favorites.includes(product.id));

  return (
    <main className="products-page favorites-page">
      <h1>{t('favorites.title')}</h1>

      {!currentUser && (
        <div className="empty-favorites">
          <p>{t('favorites.loginRequired')}</p>
          <button onClick={() => setPage("login")}>{t('cart.login')}</button>
        </div>
      )}

      {currentUser && favoriteProducts.length === 0 && (
        <div className="empty-favorites">
          <p>{t('favorites.empty')}</p>
          <button onClick={() => setPage("products")}>{t('favorites.goToProducts')}</button>
        </div>
      )}

      {currentUser && favoriteProducts.length > 0 && (
        <div className="products-grid favorites-grid">
          {favoriteProducts.map((product) => (
            <article className="shop-card" key={product.id}>
              <button className="favorite-btn active" onClick={() => toggleFavorite(product.id)}>♥</button>
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
  allProducts,
}) {
  const { t } = useTranslation();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const cartProducts = cart
    .map((cartItem) => {
      const product = allProducts.find((item) => item.id === cartItem.id);
      if (!product) return null;
      return { ...product, quantity: cartItem.quantity };
    })
    .filter(Boolean);

  const subtotal = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const promoDiscounts = { RETRO5: 0.05, RETRO10: 0.1, RETRO15: 0.15 };
  const discount = appliedPromo ? subtotal * promoDiscounts[appliedPromo] : 0;
  const total = subtotal - discount;

  function applyPromo() {
    const normalizedPromo = promoCode.trim().toUpperCase();
    if (promoDiscounts[normalizedPromo]) {
      setAppliedPromo(normalizedPromo);
      setPromoMessage(`Промокод применён: скидка ${promoDiscounts[normalizedPromo] * 100}%`);
    } else {
      setAppliedPromo("");
      setPromoMessage("Такого промокода нет");
    }
  }

  if (!currentUser) {
    return (
      <main className="cart-page">
        <h1>{t('cart.title')}</h1>
        <div className="empty-cart">
          <img src={cartLogo} alt="Корзина" />
          <p>{t('cart.empty')}</p>
          <button onClick={() => setPage("login")}>{t('cart.login')}</button>
        </div>
      </main>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <main className="cart-page">
        <h1>{t('cart.title')}</h1>
        <div className="empty-cart">
          <img src={cartLogo} alt="Корзина" />
          <p>{t('cart.empty')}</p>
          <button onClick={() => setPage("products")}>{t('cart.goToProducts')}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>{t('cart.title')}</h1>
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
                <button onClick={() => changeCartQuantity(product.id, product.quantity - 1)}>−</button>
                <span>{product.quantity}</span>
                <button onClick={() => changeCartQuantity(product.id, product.quantity + 1)}>+</button>
              </div>
              <strong className="cart-item-total">{(product.price * product.quantity).toLocaleString("ru-RU")} ₽</strong>
              <button className="cart-delete" onClick={() => removeFromCart(product.id)}>🗑</button>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <img className="cart-summary-logo" src={cartLogo} alt="FunUniverse" />
          <div className="promo-box">
            <h2>{t('cart.promo')}</h2>
            <div className="promo-row">
              <input type="text" placeholder={t('cart.enterPromo')} value={promoCode} onChange={(event) => setPromoCode(event.target.value)} />
              <button onClick={applyPromo}>✓</button>
            </div>
            {promoMessage && <p>{promoMessage}</p>}
          </div>
          <div className="delivery-box">
            <h2>{t('cart.delivery')}</h2>
            <p>{t('cart.deliveryText')}</p>
            <ul>
              <li>{t('cart.delivery1')}</li>
              <li>{t('cart.delivery2')}</li>
              <li>{t('cart.delivery3')}</li>
            </ul>
          </div>
          <div className="total-box">
            <p>{t('cart.subtotal')}: {subtotal.toLocaleString("ru-RU")} ₽</p>
            {appliedPromo && <p>{t('cart.discount')}: −{discount.toLocaleString("ru-RU")} ₽</p>}
            <h2>{t('cart.total')}: {total.toLocaleString("ru-RU")} ₽</h2>
            <button>{t('cart.checkout')}</button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function UniversesPage({ setPage, setSelectedUniverseFromPage }) {
  const { t } = useTranslation();
  const universesList = [
    { title: "Marvel", value: "Marvel", image: marvelLogo },
    { title: "Star Wars", value: "Star Wars", image: starWarsLogo },
    { title: "DC", value: "DC", image: dcLogo },
    { title: "Anime", value: "Anime", image: animeLogo },
    { title: "Games", value: "Games", image: gamesLogo },
  ];

  function openUniverse(universe) {
    setSelectedUniverseFromPage(universe);
    setPage("products");
  }

  return (
    <main className="universes-page">
      <h1>{t('universes.title')}</h1>
      <p className="universes-text">{t('universes.hint')}</p>
      <div className="universes-grid">
        {universesList.map((universe) => (
          <button className="universe-card" key={universe.value} onClick={() => openUniverse(universe.value)}>
            <img src={universe.image} alt={universe.title} />
            <span>{universe.title}</span>
          </button>
        ))}
      </div>
    </main>
  );
}

function AboutPage() {
  const { t } = useTranslation();
  const team = [
    { name: "DAYESA012", text: t('about.team.member1'), avatar: "🧑‍💻" },
    { name: "NONAMMM01", text: t('about.team.member2'), avatar: "🧙‍♀️" },
    { name: "KKSE311", text: t('about.team.member3'), avatar: "🧝" },
  ];

  const stats = [
    { title: "Сила", value: 87, className: "green" },
    { title: "Ловкость", value: 64, className: "cyan" },
    { title: "Интеллект", value: 72, className: "yellow" },
    { title: "Выносливость", value: 58, className: "pink" },
    { title: "Удача", value: 91, className: "purple" },
  ];

  const achievements = [
    { icon: "◉", title: "Первый раз", text: "Впервые посетил наш сайт", unlocked: true },
    { icon: "▣", title: "Знаток", text: "Нашёл страницу «О нас»", unlocked: true },
    { icon: "☆", title: "Звезда", text: "Провёл на сайте больше минуты", unlocked: true },
    { icon: "🔒", title: "Сокровище", text: "???", unlocked: false },
    { icon: "🎮", title: "Непробиваемый", text: "???", unlocked: false },
    { icon: "☆", title: "Легенда", text: "???", unlocked: false },
  ];

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-glow about-glow-one"></div>
        <div className="about-glow about-glow-two"></div>
        <h1>{t('about.title')}</h1>
        <p>{t('about.intro')}</p>
        <p>{t('about.text')}</p>
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
        <p><b>Fun Universe</b> — {t('about.project')}</p>
        <p>{t('about.projectText')}</p>
        <p>
          <b>{t('about.audience')}:</b> {t('about.audienceText')}<br />
          <b>{t('about.goal')}:</b> {t('about.goalText')}
        </p>
      </section>

      <section className="about-character">
        <div className="mascot-box">
          <img src={aboutMascot} alt="Наш маскот" />
          <span>{t('about.mascot')}</span>
        </div>
        <div className="stats-panel">
          <h2>▣ {t('about.stats')}</h2>
          {stats.map((stat) => (
            <div className="stat-row" key={stat.title}>
              <div className="stat-top">
                <span>{stat.title}</span>
                <span>{stat.value}</span>
              </div>
              <div className="stat-line">
                <div className={`stat-fill ${stat.className}`} style={{ width: `${stat.value}%` }}></div>
              </div>
            </div>
          ))}
          <div className="special-box">
            <h3>★ {t('about.special')}</h3>
            <p>{t('about.specialText')}</p>
          </div>
        </div>
      </section>

      <section className="about-achievements">
        <h2>{t('about.achievements')}</h2>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <article className={achievement.unlocked ? "achievement-card unlocked" : "achievement-card locked"} key={achievement.title}>
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
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(currentUser?.nickname || "");
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || "");
  const [message, setMessage] = useState("");

  if (!currentUser) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <h1>{t('profile.title')}</h1>
          <p>{t('profile.loginRequired')}</p>
          <button onClick={() => setPage("login")}>{t('header.login')}</button>
        </section>
      </main>
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("ru-RU");
  }

  function logout() {
    setCurrentUser(null);
    setPage("home");
  }

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Файл слишком большой");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    if (!currentUser || !currentUser.id) {
      setMessage("Пользователь не авторизован");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/profile/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, avatar: avatarPreview }),
      });
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
          <h1>{t('profile.title')}</h1>
          <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>✎</button>
        </div>
        <div className="profile-content">
          <div className="profile-avatar-block">
            <div className="profile-avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Аватар" />
              ) : (
                <span>{(currentUser.nickname || currentUser.login || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>
            {isEditing && (
              <label className="avatar-upload">
                {t('profile.edit')}
                <input type="file" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <div className="profile-info">
            <div className="profile-row">
              <span>{t('profile.nickname')}:</span>
              {isEditing ? (
                <input value={nickname} onChange={(event) => setNickname(event.target.value)} />
              ) : (
                <b>{currentUser.nickname}</b>
              )}
            </div>
            <div className="profile-row">
              <span>{t('profile.id')}:</span>
              <b>#{currentUser.id}</b>
            </div>
            <div className="profile-row">
              <span>{t('profile.email')}:</span>
              <b>{currentUser.email || "не указана"}</b>
            </div>
            <div className="profile-row">
              <span>{t('profile.registered')}:</span>
              <b>{formatDate(currentUser.registeredAt)}</b>
            </div>
            <div className="profile-row">
              <span>{t('profile.favoritesCount')}:</span>
              <b>{favorites.length}</b>
            </div>
            <div className="profile-row">
              <span>{t('profile.cartCount')}:</span>
              <b>{cartCount}</b>
            </div>
            {isEditing && (
              <button className="save-profile-btn" onClick={saveProfile}>{t('profile.save')}</button>
            )}
            <button className="logout-profile-btn" onClick={logout}>{t('profile.logout')}</button>
            {message && <p className="profile-message">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

function CasinoPage({ currentUser }) {
  const { t } = useTranslation();
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
    if (!saved) return { date: today, used: 0 };
    const data = JSON.parse(saved);
    if (data.date !== today) return { date: today, used: 0 };
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
    localStorage.setItem(storageKey, JSON.stringify({ date: today, used: newUsedAttempts }));
  }

  function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function choosePrize() {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;
    for (const prize of prizes) {
      random -= prize.weight;
      if (random <= 0) return prize;
    }
    return prizes[0];
  }

  function makeLoseResult() {
    const first = getRandomSymbol();
    let second = getRandomSymbol();
    while (second === first) second = getRandomSymbol();
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
    const finalResult = willWin ? [winSymbol, winSymbol, winSymbol] : makeLoseResult();

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
          setTimeout(() => setModalOpen(true), 450);
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
        <h1 className="casino-title">{t('casino.title')}</h1>
        <p className="casino-subtitle">{t('casino.subtitle')}</p>
        <div className="casino-machine">
          <div className="casino-drums">
            {drums.map((symbol, index) => (
              <div className="casino-drum" key={index}>
                <div className={isSpinning ? "casino-drum-inner spinning" : "casino-drum-inner"}>
                  {symbol}
                </div>
              </div>
            ))}
          </div>
          <button className="casino-spin-btn" onClick={spin} disabled={isSpinning || attemptsLeft <= 0}>
            {isSpinning ? t('casino.spinning') : t('casino.spin')}
          </button>
          <div className="casino-attempts">
            {t('casino.attempts')} <b>{attemptsLeft}</b> / {maxAttemptsPerDay}
          </div>
        </div>
      </section>

      {modalOpen && currentPrize && (
        <div className="casino-modal" onClick={() => setModalOpen(false)}>
          <div className="casino-modal-content" onClick={(event) => event.stopPropagation()}>
            <h2>{t('casino.win')}</h2>
            <p>{t('casino.discount')} {currentPrize.discount}%!</p>
            <div className="casino-promo-code">{currentPrize.code}</div>
            <div className="casino-modal-buttons">
              <button onClick={copyCode}>{t('casino.copy')}</button>
              <button onClick={() => setModalOpen(false)}>{t('casino.close')}</button>
            </div>
            {copyMessage && <p className="casino-copy-message">{copyMessage}</p>}
          </div>
        </div>
      )}
    </main>
  );
}

function AdminPage({ allProducts, setAllProducts }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Фигурки");
  const [universe, setUniverse] = useState("Marvel");
  const [description, setDescription] = useState("");  // ← ЕСТЬ
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function addProduct(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price: Number(price),
          category,
          universe,
          description,  // ← ОТПРАВЛЯЕТСЯ НА СЕРВЕР
          image: "",
          images: [],
          isNew,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshProducts();
        setTitle("");
        setPrice("");
        setDescription("");  // ← ОЧИЩАЕТСЯ
        setIsNew(false);
        setMessage(`✅ Товар "${data.product.title}" добавлен!`);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-page">
      <h1>Админка товаров</h1>

      <form className="admin-form" onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Название товара"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="Фигурки">Фигурки</option>
          <option value="Комиксы">Комиксы</option>
          <option value="Манга">Манга</option>
          <option value="Мерч">Мерч</option>
          <option value="Игры">Игры</option>
        </select>
        <select value={universe} onChange={(event) => setUniverse(event.target.value)}>
          <option value="Marvel">Marvel</option>
          <option value="DC">DC</option>
          <option value="Anime">Anime</option>
          <option value="Star Wars">Star Wars</option>
          <option value="Games">Games</option>
        </select>
        
        {/* ПОЛЕ ДЛЯ ОПИСАНИЯ */}
        <textarea
          placeholder="Описание товара"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows="4"
          style={{
            width: "100%",
            padding: "12px",
            border: "4px solid #111",
            borderRadius: "12px",
            background: "#eeeeee",
            color: "#111",
            fontSize: "14px",
            fontFamily: "Montserrat, sans-serif",
            resize: "vertical",
            boxSizing: "border-box"
          }}
        />

        <label style={{ display: "flex", alignItems: "center", gap: "12px", color: "white", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isNew}
            onChange={(event) => setIsNew(event.target.checked)}
            style={{ width: "24px", height: "24px", cursor: "pointer" }}
          />
          <span style={{ fontFamily: "Press Start 2P", fontSize: "12px" }}>Новинка</span>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Добавление..." : "Добавить товар"}
        </button>
      </form>


      {message && (
        <p className="admin-message" style={{
          padding: "12px",
          borderRadius: "12px",
          background: message.includes("✅") ? "#14ff42" : "#ff3b3b",
          color: message.includes("✅") ? "#000" : "#fff",
          fontFamily: "Press Start 2P",
          fontSize: "10px"
        }}>
          {message}
        </p>
      )}

      <section className="admin-products-list">
        {allProducts.length === 0 ? (
          <p style={{ color: "#fff", fontFamily: "Press Start 2P", fontSize: "12px", textAlign: "center" }}>
            {t('admin.noProducts')}
          </p>
        ) : (
          allProducts.map((product) => (
            <article className="admin-product-card" key={product.id}>
              <b>{product.title}</b>
              <span>{product.price.toLocaleString("ru-RU")} ₽</span>
              <span>{product.category} / {product.universe}</span>
              <span style={{
                color: product.isNew ? "#14ff42" : "#888",
                fontFamily: "Press Start 2P",
                fontSize: "8px"
              }}>
                {product.isNew ? t('admin.newLabel') : ""}
              </span>

              <button
                onClick={() => toggleNewStatus(product.id)}
                style={{
                  background: product.isNew ? "#14ff42" : "#555",
                  color: product.isNew ? "#000" : "#fff",
                  border: "4px solid #111",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontFamily: "Press Start 2P",
                  fontSize: "8px",
                }}
              >
                {product.isNew ? t('admin.removeFromNew') : t('admin.addToNew')}
              </button>

              <button
                onClick={() => deleteProduct(product.id)}
                style={{
                  background: "#ff3b3b",
                  color: "#fff",
                  border: "4px solid #111",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontFamily: "Press Start 2P",
                  fontSize: "8px",
                }}
              >
                {t('admin.delete')}
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

function App() {
  const [page, setPage] = useState("home");
  const [selectedUniverseFromPage, setSelectedUniverseFromPage] = useState("");
  const [selectedCategoryFromHome, setSelectedCategoryFromHome] = useState("");
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const refreshProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      if (data.success) {
        setAllProducts(data.products);
        console.log("✅ Товары загружены:", data.products);
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки товаров:", error);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  function toggleFavorite(productId) {
  if (favorites.includes(productId)) {
    setFavorites(favorites.filter((id) => id !== productId));
    // Обновляем localStorage
    const updated = favorites.filter((id) => id !== productId);
    localStorage.setItem('favorites', JSON.stringify(updated));
  } else {
    setFavorites([...favorites, productId]);
    localStorage.setItem('favorites', JSON.stringify([...favorites, productId]));
  }
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    try {
      setFavorites(JSON.parse(savedFavorites));
    } catch (e) {
      console.error('Ошибка загрузки избранного из localStorage');
    }
  }
}

  function addToCart(productId) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find((item) => item.id === productId);
      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { id: productId, quantity: 1 }];
    });
  }

  function changeCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
      return;
    }
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  }

  return (
    <div className="app">
      <Header setPage={setPage} currentUser={currentUser} />

      {page === "home" && (
        <HomePage
          setPage={setPage}
          setSelectedCategoryFromHome={setSelectedCategoryFromHome}
          addToCart={addToCart}
          allProducts={allProducts}
          currentUser={currentUser}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
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
          allProducts={allProducts}
        />
      )}

      {page === "universes" && (
        <UniversesPage
          setPage={setPage}
          setSelectedUniverseFromPage={setSelectedUniverseFromPage}
        />
      )}

      {page === "about" && <AboutPage />}

      {page === "admin" && (
        <AdminPage allProducts={allProducts} setAllProducts={setAllProducts} />
      )}

      {page === "favorites" && (
        <FavoritesPage
          currentUser={currentUser}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          setPage={setPage}
          allProducts={allProducts}
        />
      )}

      {page === "cart" && (
        <CartPage
          currentUser={currentUser}
          cart={cart}
          changeCartQuantity={changeCartQuantity}
          removeFromCart={removeFromCart}
          setPage={setPage}
          allProducts={allProducts}
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
