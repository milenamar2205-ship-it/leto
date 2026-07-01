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
import CoinsShop from "./components/CoinsShop";

// ===== CONTEXT ДЛЯ РЕЖИМА СЛАБОВИДЯЩИХ =====
import { createContext, useContext } from 'react';

const VisionContext = createContext();

export function VisionProvider({ children }) {
  const [isVisionMode, setIsVisionMode] = useState(() => {
    return localStorage.getItem('visionMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('visionMode', isVisionMode);
    if (isVisionMode) {
      document.body.classList.add('vision-mode');
    } else {
      document.body.classList.remove('vision-mode');
    }
  }, [isVisionMode]);

  const toggleVisionMode = () => {
    setIsVisionMode(prev => !prev);
  };

  return (
    <VisionContext.Provider value={{ isVisionMode, toggleVisionMode }}>
      {children}
    </VisionContext.Provider>
  );
}

export function useVision() {
  return useContext(VisionContext);
}

// ===== HEADER =====
function Header({ setPage, currentUser, isAdmin }) {
  const { t, i18n } = useTranslation();
  const { isVisionMode, toggleVisionMode } = useVision();

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
        {isAdmin && (
          <>
            <button onClick={() => setPage("admin")}>{t('header.admin')}</button>
            <button onClick={() => setPage("support-admin")}>Чаты</button>
          </>
        )}
      </nav>

      <div className="header-actions">
        <button 
          className={`header-icon vision-toggle ${isVisionMode ? 'active' : ''}`}
          onClick={toggleVisionMode}
          title={t('header.visionMode')}
        >
          
        </button>

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
          ❤
        </button>
        <button className="header-icon" onClick={() => setPage("cart")}>
          🛒
        </button>
        
        {currentUser && (
          <button className="header-coins-btn" onClick={() => setPage("coins")}>
            🪙 <span className="coins-count">{currentUser.coins || 0}</span>
          </button>
        )}

        {currentUser ? (
          <button className="profile-header-btn" onClick={() => setPage("profile")}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={t('header.profile')} />
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

// ===== DINO RUNNER =====
function DinoRunner({ currentUser, setCurrentUser }) {
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

    async function endGame() {
      gameState = "over";
      const currentScore = Math.floor(score);
      
      if (currentScore > hiScore) {
        hiScore = currentScore;
        localStorage.setItem("dinoHiScore", hiScore);
        hiScoreEl.textContent = String(hiScore).padStart(5, "0");
      }
      
      finalScoreEl.textContent = currentScore;
      gameOverEl.style.display = "flex";
      
      const coinsEarned = Math.floor(currentScore / 100) * 50;
      
      if (coinsEarned > 0 && currentUser && currentUser.id) {
        try {
          const response = await fetch("http://localhost:3001/api/coins/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.id,
              amount: coinsEarned,
              reason: `Dino Runner: ${currentScore} очков`
            }),
          });
          
          const data = await response.json();
          
          if (data.success && setCurrentUser) {
            const updatedUser = { ...currentUser, coins: data.coins };
            setCurrentUser(updatedUser);
            
            const coinDisplay = document.createElement('div');
            coinDisplay.className = 'dino-score-coins';
            coinDisplay.textContent = `+${coinsEarned} 🪙`;
            document.body.appendChild(coinDisplay);
            coinDisplay.style.display = 'block';
            
            setTimeout(() => {
              coinDisplay.style.display = 'none';
              document.body.removeChild(coinDisplay);
            }, 3000);
          }
        } catch (error) {
          console.error("❌ Ошибка начисления монет:", error);
        }
      }
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
  }, [currentUser, setCurrentUser]);

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

// ===== HOMEPAGE =====
function HomePage({
  setPage,
  setSelectedCategoryFromHome,
  addToCart,
  allProducts,
  currentUser,
  setCurrentUser,
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
    showNotification(t('notifications.addedToCart', { title: product?.title || t('notifications.product') }), "success");
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
        ? t('notifications.removedFromFavorites', { title: product?.title || t('notifications.product') })
        : t('notifications.addedToFavorites', { title: product?.title || t('notifications.product') }),
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

      <DinoRunner currentUser={currentUser} setCurrentUser={setCurrentUser} />

      <section className="about-section" id="about-project">
        <h2>{t('home.about.title')}</h2>
        <p>{t('home.about.text')}</p>
      </section>

      {selectedProduct && (
        <ProductCard
          product={selectedProduct}
          onClose={closeProduct}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          addToCart={addToCart}
          toggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      )}
    </main>
  );
}

// ===== LOGIN PAGE =====
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
        const userWithFavorites = {
          ...data.user,
          favorites: data.user.favorites || []
        };
        setCurrentUser(userWithFavorites);
        localStorage.setItem('favorites', JSON.stringify(userWithFavorites.favorites || []));
      }
      if (data.success && mode === "register") {
        setMode("login");
        setPassword("");
        setMessage(t('login.registerSuccess'));
        setSuccess(true);
      }
    } catch (error) {
      setMessage(t('login.connectionError'));
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

// ===== PRODUCTS PAGE =====
function ProductsPage({
  currentUser,
  setCurrentUser,
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
          setCurrentUser={setCurrentUser}
          addToCart={addToCart}
          toggleFavorite={toggleFavorite}
          favorites={favorites}
        />
      )}
    </main>
  );
}

// ===== FOOTER =====
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

// ===== FAVORITES PAGE =====
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

// ===== CART PAGE =====
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
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [userPromos, setUserPromos] = useState([]);
  const [showPromoSelect, setShowPromoSelect] = useState(false);
  const [loadingPromos, setLoadingPromos] = useState(false);

  // Загружаем промокоды пользователя
  useEffect(() => {
    if (currentUser) {
      loadUserPromos();
    }
  }, [currentUser]);

  async function loadUserPromos() {
    if (!currentUser) return;
    
    setLoadingPromos(true);
    try {
      const response = await fetch(`http://localhost:3001/api/promos/user/${currentUser.id}`);
      const data = await response.json();
      if (data.success) {
        const available = data.promos.filter(p => !p.used);
        setUserPromos(available);
      }
    } catch (error) {
      console.error("Ошибка загрузки промокодов:", error);
    } finally {
      setLoadingPromos(false);
    }
  }

  const cartProducts = cart
    .map((cartItem) => {
      const product = allProducts.find((item) => item.id === cartItem.id);
      if (!product) return null;
      return { ...product, quantity: cartItem.quantity };
    })
    .filter(Boolean);

  const subtotal = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
  
  // Все доступные промокоды (казино + купленные)
  const PROMO_DISCOUNTS = {
    RETRO5: 0.05,
    RETRO10: 0.10,
    RETRO15: 0.15,
    COINS5: 0.05,
    COINS10: 0.10,
    COINS30: 0.30
  };

  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const total = subtotal - discount;

  // Применить промокод (ручной ввод)
  async function applyPromo() {
    const normalizedPromo = promoCode.trim().toUpperCase();
    
    if (!PROMO_DISCOUNTS[normalizedPromo]) {
      setAppliedPromo(null);
      setPromoMessage(t('cart.invalidPromo'));
      return;
    }

    // Проверяем, если это казино-промокод (не требует покупки)
    if (normalizedPromo.startsWith('RETRO')) {
      setAppliedPromo({
        code: normalizedPromo,
        discount: PROMO_DISCOUNTS[normalizedPromo]
      });
      setPromoMessage(`${t('cart.promoApplied')} ${PROMO_DISCOUNTS[normalizedPromo] * 100}%`);
      setPromoCode("");
      return;
    }

    // Для купленных промокодов - проверяем через API
    try {
      const response = await fetch("http://localhost:3001/api/promos/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          promoCode: normalizedPromo
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAppliedPromo({
          code: data.promoCode,
          discount: data.discount
        });
        setPromoMessage(`${t('cart.promoApplied')} ${data.discount * 100}%`);
        setPromoCode("");
        loadUserPromos(); // Обновляем список доступных промокодов
      } else {
        setAppliedPromo(null);
        setPromoMessage(data.message || t('cart.invalidPromo'));
      }
    } catch (error) {
      setPromoMessage(t('cart.applyError'));
    }
  }

  // Применить промокод из списка
  async function applyUserPromo(promo) {
    try {
      const response = await fetch("http://localhost:3001/api/promos/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          promoCode: promo.promoCode
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAppliedPromo({
          code: data.promoCode,
          discount: data.discount
        });
        setPromoMessage(`${t('cart.promoApplied')} ${data.discount * 100}%`);
        loadUserPromos();
        setShowPromoSelect(false);
      } else {
        setPromoMessage(data.message || t('cart.invalidPromo'));
      }
    } catch (error) {
      setPromoMessage(t('cart.applyError'));
    }
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoMessage("");
  }

  if (!currentUser) {
    return (
      <main className="cart-page">
        <h1>{t('cart.title')}</h1>
        <div className="empty-cart">
          <img src={cartLogo} alt={t('cart.title')} />
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
          <img src={cartLogo} alt={t('cart.title')} />
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
            
            {/* Кнопка показать доступные промокоды */}
            {userPromos.length > 0 && (
              <button 
                className="show-promos-btn"
                onClick={() => setShowPromoSelect(!showPromoSelect)}
              >
                {showPromoSelect ? '✕' : `📋 ${t('cart.availablePromos')} (${userPromos.length})`}
              </button>
            )}

            {/* Список доступных промокодов */}
            {showPromoSelect && userPromos.length > 0 && (
              <div className="promo-list">
                <p className="promo-list-title">{t('cart.yourPromos')}:</p>
                {userPromos.map((promo) => (
                  <button 
                    key={promo.id}
                    className="promo-item"
                    onClick={() => applyUserPromo(promo)}
                  >
                    <span className="promo-code">{promo.promoCode}</span>
                    <span className="promo-discount">-{Math.round(promo.discount * 100)}%</span>
                  </button>
                ))}
              </div>
            )}

            <div className="promo-row">
              <input 
                type="text" 
                placeholder={t('cart.enterPromo')} 
                value={promoCode} 
                onChange={(event) => setPromoCode(event.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
              />
              <button onClick={applyPromo}>{t('cart.apply')}</button>
            </div>

            {/* Отображение применённого промокода */}
            {appliedPromo && (
              <div className="applied-promo">
                <span>
                  ✅ {t('cart.promoApplied')}: <b>{appliedPromo.code}</b> (-{Math.round(appliedPromo.discount * 100)}%)
                </span>
                <button className="remove-promo" onClick={removePromo}>✕</button>
              </div>
            )}

            {promoMessage && !appliedPromo && (
              <p className="promo-message error">{promoMessage}</p>
            )}
            {promoMessage && appliedPromo && (
              <p className="promo-message success">{promoMessage}</p>
            )}
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
            {appliedPromo && (
              <p className="discount-line">
                {t('cart.discount')} ({appliedPromo.code}): −{discount.toLocaleString("ru-RU")} ₽
              </p>
            )}
            <h2>{t('cart.total')}: {total.toLocaleString("ru-RU")} ₽</h2>
            <button>{t('cart.checkout')}</button>
          </div>
        </aside>
      </div>
    </main>
  );
}

// ===== UNIVERSES PAGE =====
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

// ===== ABOUT PAGE =====
function AboutPage() {
  const { t } = useTranslation();
  const team = [
    { name: "DAYESA012", text: t('about.team.member1'), avatar: "🧑‍💻" },
    { name: "NONAMMM01", text: t('about.team.member2'), avatar: "🧙‍♀️" },
    { name: "KKSE311", text: t('about.team.member3'), avatar: "🧝" },
  ];

  const stats = [
    { title: t('about.statsStrength'), value: 87, className: "green" },
    { title: t('about.statsAgility'), value: 64, className: "cyan" },
    { title: t('about.statsIntelligence'), value: 72, className: "yellow" },
    { title: t('about.statsEndurance'), value: 58, className: "pink" },
    { title: t('about.statsLuck'), value: 91, className: "purple" },
  ];

  const achievements = [
    { icon: "◉", title: t('about.achievementFirst'), text: t('about.achievementFirstText'), unlocked: true },
    { icon: "▣", title: t('about.achievementExpert'), text: t('about.achievementExpertText'), unlocked: true },
    { icon: "☆", title: t('about.achievementStar'), text: t('about.achievementStarText'), unlocked: true },
    { icon: "🔒", title: t('about.achievementTreasure'), text: "???", unlocked: false },
    { icon: "🎮", title: t('about.achievementUnbreakable'), text: "???", unlocked: false },
    { icon: "☆", title: t('about.achievementLegend'), text: "???", unlocked: false },
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
          <img src={aboutMascot} alt={t('about.mascot')} />
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

// ===== PROFILE PAGE =====
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
      alert(t('profile.fileTooBig'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    if (!currentUser || !currentUser.id) {
      setMessage(t('profile.notAuthorized'));
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
      setMessage(t('profile.connectionError'));
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
                <img src={avatarPreview} alt={t('profile.avatar')} />
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
              <b>{currentUser.email || t('profile.notSpecified')}</b>
            </div>
            <div className="profile-row">
              <span>{t('profile.registered')}:</span>
              <b>{formatDate(currentUser.registeredAt)}</b>
            </div>
            <div className="profile-row">
              <span>{t('profile.coins')}:</span>
              <b>🪙 {currentUser.coins || 0}</b>
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

// ===== CASINO PAGE =====
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
      alert(t('casino.noAttempts'));
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
      setCopyMessage(t('casino.copied'));
    } catch {
      setCopyMessage(`${t('casino.code')}: ${currentPrize.code}`);
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

// ===== ADMIN PAGE =====
function AdminPage({ allProducts, setAllProducts }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Фигурки");
  const [universe, setUniverse] = useState("Marvel");
  const [description, setDescription] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function refreshProducts() {
    try {
      const response = await fetch("http://localhost:3001/api/products");
      const data = await response.json();
      if (data.success) {
        setAllProducts(data.products);
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

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
          description,
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
        setDescription("");
        setIsNew(false);
        setMessage(t('admin.productAdded', { title: data.product.title, isNew: data.product.isNew ? t('admin.yes') : t('admin.no') }));
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ " + data.message);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ " + t('admin.connectionError'));
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  }

  async function toggleNewStatus(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          isNew: !product.isNew
        }),
      });
      const data = await response.json();
      if (data.success) {
        await refreshProducts();
        setMessage(t('admin.newStatusUpdated', { 
          status: data.product.isNew ? t('admin.newStatusAdded') : t('admin.newStatusRemoved') 
        }));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ " + t('admin.connectionError'));
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function deleteProduct(productId) {
    if (!confirm(t('admin.confirmDelete'))) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await refreshProducts();
        setMessage(t('admin.productDeleted'));
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ " + t('admin.connectionError'));
      setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <main className="admin-page">
      <h1>{t('admin.title')}</h1>

      <form className="admin-form" onSubmit={addProduct}>
        <input
          type="text"
          placeholder={t('admin.name')}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <input
          type="number"
          placeholder={t('admin.price')}
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
        
        <textarea
          placeholder={t('admin.description')}
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
          <span style={{ fontFamily: "Press Start 2P", fontSize: "12px" }}>{t('admin.isNew')}</span>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? t('admin.adding') : t('admin.addBtn')}
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

// ===== SUPPORT WIDGET =====
function SupportWidget({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  async function loadChat() {
    if (!currentUser) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/support/user/${currentUser.id}`
      );

      const data = await response.json();

      if (data.success) {
        setChat(data.chat);

        if (isOpen && data.chat) {
          await fetch(`http://localhost:3001/api/support/user/${data.chat.id}/read`, {
            method: "PUT",
          });
        }
      }
    } catch {
      console.log("Ошибка загрузки чата");
    }
  }

  useEffect(() => {
    loadChat();

    const interval = setInterval(loadChat, 3000);

    return () => clearInterval(interval);
  }, [currentUser, isOpen]);

  function handleFile(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимум 5 МБ");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFile({
        name: selectedFile.name,
        type: selectedFile.type,
        data: reader.result,
      });
    };

    reader.readAsDataURL(selectedFile);
  }

  async function sendMessage() {
    if (!text.trim() && !file) return;

    const response = await fetch("http://localhost:3001/api/support/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: currentUser,
        text: text,
        file: file,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setChat(data.chat);
      setText("");
      setFile(null);
    }
  }

  const unreadCount = chat?.userUnread || 0;

  return (
    <>
      <button className="support-float-btn" onClick={() => setIsOpen(true)}>
        💬

        {unreadCount > 0 && (
          <span className="support-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="support-window">
          <div className="support-header">
            <div>
              <h2>Поддержка</h2>
              <p>Мы всегда на связи</p>
            </div>

            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="support-messages">
            {!chat && (
              <div className="support-message admin">
                <div className="support-avatar">🎮</div>
                <div className="support-bubble">
                  Привет 👋 Мы всегда на связи. Чем могу помочь?
                </div>
              </div>
            )}

            {chat?.messages?.map((message) => (
              <div
                className={
                  message.sender === "user"
                    ? "support-message user"
                    : "support-message admin"
                }
                key={message.id}
              >
                {message.sender === "admin" && (
                  <div className="support-avatar">🎮</div>
                )}

                <div className="support-bubble">
                  {message.text && <p>{message.text}</p>}

                  {message.file && (
                    <a
                      href={message.file.data}
                      download={message.file.name}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📎 {message.file.name}
                    </a>
                  )}

                  <span>
                    {new Date(message.createdAt).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {file && (
            <div className="support-file-preview">
              📎 {file.name}
              <button onClick={() => setFile(null)}>×</button>
            </div>
          )}

          <div className="support-input-row">
            <label className="support-file-btn">
              📎
              <input type="file" onChange={handleFile} />
            </label>

            <label className="support-file-btn">
              📷
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFile}
              />
            </label>

            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ваше сообщение..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

// ===== SUPPORT ADMIN PAGE =====
function SupportAdminPage({ currentUser }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  async function loadChats() {
    try {
      const response = await fetch("http://localhost:3001/api/support/admin/chats");
      const data = await response.json();

      if (data.success) {
        setChats(data.chats);
      }
    } catch {
      console.log("Ошибка загрузки чатов");
    }
  }

  async function openChat(chatId) {
    const response = await fetch(
      `http://localhost:3001/api/support/admin/chats/${chatId}`
    );

    const data = await response.json();

    if (data.success) {
      setSelectedChat(data.chat);
      loadChats();
    }
  }

  useEffect(() => {
    loadChats();

    const interval = setInterval(loadChats, 3000);

    return () => clearInterval(interval);
  }, []);

  function handleFile(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимум 5 МБ");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFile({
        name: selectedFile.name,
        type: selectedFile.type,
        data: reader.result,
      });
    };

    reader.readAsDataURL(selectedFile);
  }

  async function sendAdminMessage() {
    if (!selectedChat) return;
    if (!text.trim() && !file) return;

    const response = await fetch("http://localhost:3001/api/support/admin-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: selectedChat.id,
        text: text,
        file: file,
      }),
    });

    const data = await response.json();

    if (data.success) {
      setSelectedChat(data.chat);
      setText("");
      setFile(null);
      loadChats();
    }
  }

  async function finishChat(chatId) {
    const response = await fetch(`http://localhost:3001/api/support/${chatId}/finish`, {
      method: "PUT",
    });

    const data = await response.json();

    if (data.success) {
      setSelectedChat(data.chat);
      loadChats();
    }
  }

  async function deleteChat(chatId) {
    const agree = confirm("Удалить чат полностью?");

    if (!agree) return;

    await fetch(`http://localhost:3001/api/support/${chatId}`, {
      method: "DELETE",
    });

    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }

    loadChats();
  }

  return (
    <main className="support-admin-page">
      <h1>Чаты поддержки</h1>

      <div className="support-admin-layout">
        <aside className="support-chat-list">
          {chats.length === 0 && <p>Пока нет обращений</p>}

          {chats.map((chat) => (
            <div className="support-chat-list-item" key={chat.id}>
              <button onClick={() => openChat(chat.id)}>
                <strong>{chat.userNickname || chat.userLogin}</strong>
                <span>{chat.userEmail}</span>

                {chat.isNew && <em>Новый чат</em>}

                {chat.adminUnread > 0 && (
                  <b className="admin-chat-badge">{chat.adminUnread}</b>
                )}

                {chat.status === "finished" && <small>Завершён</small>}
              </button>

              <button
                className="delete-chat-btn"
                onClick={() => deleteChat(chat.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </aside>

        <section className="support-admin-chat">
          {!selectedChat && (
            <div className="support-admin-empty">
              Выбери чат слева
            </div>
          )}

          {selectedChat && (
            <>
              <div className="support-admin-chat-header">
                <div>
                  <h2>{selectedChat.userNickname}</h2>
                  <p>{selectedChat.userEmail}</p>
                </div>

                <button onClick={() => finishChat(selectedChat.id)}>
                  Завершить диалог
                </button>
              </div>

              <div className="support-admin-messages">
                {selectedChat.messages.map((message) => (
                  <div
                    className={
                      message.sender === "admin"
                        ? "admin-message-row admin"
                        : "admin-message-row user"
                    }
                    key={message.id}
                  >
                    <div className="support-bubble">
                      {message.text && <p>{message.text}</p>}

                      {message.file && (
                        <a
                          href={message.file.data}
                          download={message.file.name}
                          target="_blank"
                          rel="noreferrer"
                        >
                          📎 {message.file.name}
                        </a>
                      )}

                      <span>
                        {new Date(message.createdAt).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {file && (
                <div className="support-file-preview">
                  📎 {file.name}
                  <button onClick={() => setFile(null)}>×</button>
                </div>
              )}

              <div className="support-input-row">
                <label className="support-file-btn">
                  📎
                  <input type="file" onChange={handleFile} />
                </label>

                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Ответ пользователю..."
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendAdminMessage();
                    }
                  }}
                />

                <button onClick={sendAdminMessage}>➤</button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

// ===== APP =====
function App() {
  const [page, setPage] = useState("home");
  const [selectedUniverseFromPage, setSelectedUniverseFromPage] = useState("");
  const [selectedCategoryFromHome, setSelectedCategoryFromHome] = useState("");
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const ADMIN_EMAIL = "adminaccc001@gmail.com";
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

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
      const updated = favorites.filter((id) => id !== productId);
      localStorage.setItem('favorites', JSON.stringify(updated));
    } else {
      setFavorites([...favorites, productId]);
      localStorage.setItem('favorites', JSON.stringify([...favorites, productId]));
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
    <VisionProvider>
      <div className="app">
        <Header setPage={setPage} currentUser={currentUser} isAdmin={isAdmin} />

        {page === "home" && (
          <HomePage
            setPage={setPage}
            setSelectedCategoryFromHome={setSelectedCategoryFromHome}
            addToCart={addToCart}
            allProducts={allProducts}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}

        {page === "coins" && (
          <CoinsShop currentUser={currentUser} setCurrentUser={setCurrentUser} />
        )}

        {page === "casino" && <CasinoPage currentUser={currentUser} />}

        {page === "products" && (
          <ProductsPage
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
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

        {page === "admin" && isAdmin && (
          <AdminPage allProducts={allProducts} setAllProducts={setAllProducts} />
        )}

        {page === "support-admin" && isAdmin && (
          <SupportAdminPage currentUser={currentUser} />
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
        {currentUser && !isAdmin && <SupportWidget currentUser={currentUser} />}
      </div>
    </VisionProvider>
  );
}

export default App;
