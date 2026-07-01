const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3001;

const USERS_FILE = path.join(__dirname, "users.json");
const PRODUCTS_FILE = path.join(__dirname, "products.json");
const REVIEWS_FILE = path.join(__dirname, "reviews.json");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ========== РАБОТА С ФАЙЛАМИ ==========

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
  const data = fs.readFileSync(filePath, "utf-8");
  if (!data.trim()) return [];
  return JSON.parse(data);
}

function saveJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function readUsers() {
  return readJsonFile(USERS_FILE);
}

function saveUsers(users) {
  saveJsonFile(USERS_FILE, users);
}

function readProducts() {
  return readJsonFile(PRODUCTS_FILE);
}

function saveProducts(products) {
  saveJsonFile(PRODUCTS_FILE, products);
}

function readReviews() {
  return readJsonFile(REVIEWS_FILE);
}

function saveReviews(reviews) {
  saveJsonFile(REVIEWS_FILE, reviews);
}

function generateNickname(login, id) {
  return login + "_" + id;
}

// ========== ТЕСТОВЫЙ МАРШРУТ ==========

app.get("/", function (request, response) {
  response.send("Сервер работает ✅");
});

// ========== ПОЛЬЗОВАТЕЛИ ==========

app.post("/api/register", function (request, response) {
  console.log("📝 Запрос на регистрацию:", request.body);

  const { login, password, email } = request.body;

  if (!login || !password || !email) {
    return response.status(400).json({
      success: false,
      message: "Введите логин, почту и пароль",
    });
  }

  if (login.length < 3) {
    return response.status(400).json({
      success: false,
      message: "Логин должен быть не короче 3 символов",
    });
  }

  if (password.length < 4) {
    return response.status(400).json({
      success: false,
      message: "Пароль должен быть не короче 4 символов",
    });
  }

  const users = readUsers();

  const existingUser = users.find(function (user) {
    return user.login === login;
  });

  if (existingUser) {
    return response.status(409).json({
      success: false,
      message: "Пользователь с таким логином уже существует",
    });
  }

  const existingEmail = users.find(function (user) {
    return user.email === email;
  });

  if (existingEmail) {
    return response.status(409).json({
      success: false,
      message: "Пользователь с такой почтой уже существует",
    });
  }

  const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: newId,
    login: login,
    password: hashedPassword,
    email: email,
    nickname: generateNickname(login, newId),
    avatar: "",
    favorites: [],
    registeredAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  console.log("✅ Пользователь создан:", newUser.login);

  return response.json({
    success: true,
    message: "Аккаунт создан. Теперь можно войти",
    user: {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      nickname: newUser.nickname,
      avatar: newUser.avatar,
      favorites: [],
      registeredAt: newUser.registeredAt,
    },
  });
});

app.post("/api/login", function (request, response) {
  console.log("🔑 Запрос на вход:", request.body);

  const { login, password } = request.body;

  if (!login || !password) {
    return response.status(400).json({
      success: false,
      message: "Введите логин или почту и пароль",
    });
  }

  const users = readUsers();

  const user = users.find(function (item) {
    return item.login === login || item.email === login;
  });

  if (!user) {
    return response.status(401).json({
      success: false,
      message: "Неверный логин, почта или пароль",
    });
  }

  const passwordIsCorrect = bcrypt.compareSync(password, user.password);

  if (!passwordIsCorrect) {
    return response.status(401).json({
      success: false,
      message: "Неверный логин, почта или пароль",
    });
  }

  console.log("✅ Вход выполнен для:", user.login);

  return response.json({
    success: true,
    message: "Вход выполнен успешно",
    user: {
      id: user.id,
      login: user.login,
      email: user.email || "",
      nickname: user.nickname || user.login,
      avatar: user.avatar || "",
      favorites: user.favorites || [],
      registeredAt: user.registeredAt,
    },
  });
});

app.put("/api/profile/:id", function (request, response) {
  const userId = Number(request.params.id);
  const { nickname, avatar } = request.body;

  const users = readUsers();

  const user = users.find(function (item) {
    return item.id === userId;
  });

  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден",
    });
  }

  if (!nickname || nickname.trim().length < 2) {
    return response.status(400).json({
      success: false,
      message: "Никнейм должен быть не короче 2 символов",
    });
  }

  user.nickname = nickname.trim();

  if (avatar !== undefined) {
    user.avatar = avatar;
  }

  saveUsers(users);

  return response.json({
    success: true,
    message: "Профиль обновлён",
    user: {
      id: user.id,
      login: user.login,
      email: user.email || "",
      nickname: user.nickname || user.login,
      avatar: user.avatar || "",
      favorites: user.favorites || [],
      registeredAt: user.registeredAt,
    },
  });
});

// ========== ИЗБРАННОЕ ==========

// Получить избранное пользователя
app.get("/api/favorites/:userId", function (request, response) {
  const userId = Number(request.params.id);
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден"
    });
  }
  
  return response.json({
    success: true,
    favorites: user.favorites || []
  });
});

// Добавить в избранное
app.post("/api/favorites", function (request, response) {
  const { userId, productId } = request.body;
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден"
    });
  }
  
  if (!user.favorites) {
    user.favorites = [];
  }
  
  if (!user.favorites.includes(productId)) {
    user.favorites.push(productId);
    saveUsers(users);
  }
  
  return response.json({
    success: true,
    message: "Добавлено в избранное",
    favorites: user.favorites
  });
});

// Удалить из избранного
app.delete("/api/favorites", function (request, response) {
  const { userId, productId } = request.body;
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден"
    });
  }
  
  if (user.favorites) {
    user.favorites = user.favorites.filter(id => id !== productId);
    saveUsers(users);
  }
  
  return response.json({
    success: true,
    message: "Удалено из избранного",
    favorites: user.favorites
  });
});

// ========== ТОВАРЫ ==========

app.get("/api/products", function (request, response) {
  const products = readProducts();
  console.log("📦 Запрос товаров, найдено:", products.length);
  return response.json({
    success: true,
    products: products,
  });
});

app.get("/api/products/:id", function (request, response) {
  const productId = Number(request.params.id);
  const products = readProducts();
  const product = products.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    return response.status(404).json({
      success: false,
      message: "Товар не найден",
    });
  }

  return response.json({
    success: true,
    product: product,
  });
});

app.post("/api/products", function (request, response) {
  const { title, price, category, universe, description, image, images, isNew } = request.body;

  console.log("📝 Добавление товара:", title);

  if (!title || !price || !category || !universe) {
    return response.status(400).json({
      success: false,
      message: "Заполните название, цену, категорию и вселенную",
    });
  }

  const products = readProducts();

  const newId = products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    title: title,
    price: Number(price),
    category: category,
    universe: universe,
    description: description || "",
    image: image || "",
    images: images || [],
    isNew: isNew || false,
    rating: 0,
    reviewsCount: 0,
  };

  products.push(newProduct);
  saveProducts(products);
  console.log("✅ Товар добавлен, ID:", newId);

  return response.json({
    success: true,
    message: "Товар добавлен",
    product: newProduct,
  });
});

app.put("/api/products/:id", function (request, response) {
  const productId = Number(request.params.id);
  const { title, price, category, universe, description, image, images, isNew } = request.body;

  console.log("📝 Обновление товара ID:", productId);

  const products = readProducts();

  const product = products.find(function (item) {
    return item.id === productId;
  });

  if (!product) {
    return response.status(404).json({
      success: false,
      message: "Товар не найден",
    });
  }

  if (title !== undefined) product.title = title;
  if (price !== undefined) product.price = Number(price);
  if (category !== undefined) product.category = category;
  if (universe !== undefined) product.universe = universe;
  if (description !== undefined) product.description = description;
  if (image !== undefined) product.image = image;
  if (images !== undefined) product.images = images;
  if (isNew !== undefined) product.isNew = isNew;

  saveProducts(products);
  console.log("✅ Товар обновлён, ID:", productId);

  return response.json({
    success: true,
    message: "Товар обновлён",
    product: product,
  });
});

app.delete("/api/products/:id", function (request, response) {
  const productId = Number(request.params.id);

  console.log("🗑️ Удаление товара ID:", productId);

  const products = readProducts();

  const filteredProducts = products.filter(function (product) {
    return product.id !== productId;
  });

  if (filteredProducts.length === products.length) {
    return response.status(404).json({
      success: false,
      message: "Товар не найден",
    });
  }

  saveProducts(filteredProducts);
  console.log("✅ Товар удалён, ID:", productId);

  return response.json({
    success: true,
    message: "Товар удалён",
  });
});

// ========== ОТЗЫВЫ ==========

app.get("/api/reviews/:productId", function (request, response) {
  const productId = Number(request.params.productId);
  const reviews = readReviews();
  const productReviews = reviews.filter(function (review) {
    return review.productId === productId;
  });

  console.log(`📥 Запрос отзывов для товара ${productId}, найдено: ${productReviews.length}`);

  return response.json({
    success: true,
    reviews: productReviews,
  });
});

app.post("/api/reviews", function (request, response) {
  const { productId, userId, userName, rating, text } = request.body;

  console.log("📝 Новый отзыв:", { productId, userId, userName, rating, text });

  if (!productId || !userId || !userName || !rating || !text) {
    console.log("❌ Не все поля заполнены");
    return response.status(400).json({
      success: false,
      message: "Заполните все поля",
    });
  }

  if (rating < 1 || rating > 5) {
    console.log("❌ Неверный рейтинг:", rating);
    return response.status(400).json({
      success: false,
      message: "Рейтинг должен быть от 1 до 5",
    });
  }

  const reviews = readReviews();

  // Проверяем, не оставлял ли пользователь уже отзыв
  const existingReview = reviews.find(function (review) {
    return review.productId === productId && review.userId === userId;
  });

  if (existingReview) {
    console.log("❌ Пользователь уже оставлял отзыв");
    return response.status(409).json({
      success: false,
      message: "Вы уже оставляли отзыв на этот товар",
    });
  }

  const newId = reviews.length > 0 ? Math.max(...reviews.map((review) => review.id)) + 1 : 1;

  const newReview = {
    id: newId,
    productId: productId,
    userId: userId,
    userName: userName,
    rating: rating,
    text: text,
    date: new Date().toISOString(),
  };

  reviews.push(newReview);
  saveReviews(reviews);
  console.log("✅ Отзыв сохранён, ID:", newId);

  // Обновляем рейтинг товара
  const products = readProducts();
  const product = products.find(function (item) {
    return item.id === productId;
  });

  if (product) {
    const productReviews = reviews.filter(function (review) {
      return review.productId === productId;
    });

    const totalRating = productReviews.reduce(function (sum, review) {
      return sum + review.rating;
    }, 0);

    product.rating = Math.round((totalRating / productReviews.length) * 10) / 10;
    product.reviewsCount = productReviews.length;

    saveProducts(products);
    console.log(`⭐ Обновлён рейтинг товара ${product.title}: ${product.rating} (${product.reviewsCount} отзывов)`);
  }

  return response.json({
    success: true,
    message: "Отзыв добавлен",
    review: newReview,
  });
});

app.delete("/api/reviews/:id", function (request, response) {
  const reviewId = Number(request.params.id);
  const { userId } = request.body;

  console.log("🗑️ Удаление отзыва ID:", reviewId);

  const reviews = readReviews();

  const reviewIndex = reviews.findIndex(function (review) {
    return review.id === reviewId;
  });

  if (reviewIndex === -1) {
    return response.status(404).json({
      success: false,
      message: "Отзыв не найден",
    });
  }

  const review = reviews[reviewIndex];

  if (review.userId !== userId) {
    return response.status(403).json({
      success: false,
      message: "Вы можете удалить только свои отзывы",
    });
  }

  reviews.splice(reviewIndex, 1);
  saveReviews(reviews);
  console.log("✅ Отзыв удалён");

  // Обновляем рейтинг товара
  const products = readProducts();
  const product = products.find(function (item) {
    return item.id === review.productId;
  });

  if (product) {
    const productReviews = reviews.filter(function (item) {
      return item.productId === review.productId;
    });

    if (productReviews.length > 0) {
      const totalRating = productReviews.reduce(function (sum, item) {
        return sum + item.rating;
      }, 0);
      product.rating = Math.round((totalRating / productReviews.length) * 10) / 10;
      product.reviewsCount = productReviews.length;
    } else {
      product.rating = 0;
      product.reviewsCount = 0;
    }

    saveProducts(products);
    console.log(`⭐ Обновлён рейтинг товара после удаления: ${product.rating}`);
  }

  return response.json({
    success: true,
    message: "Отзыв удалён",
  });
});

// ========== ЗАПУСК СЕРВЕРА ==========

app.listen(PORT, function () {
  console.log("🚀 Сервер запущен на порту " + PORT);
  console.log("🔗 Проверка сервера: http://localhost:" + PORT);
  console.log("📦 Товары: http://localhost:" + PORT + "/api/products");
  console.log("💬 Отзывы: http://localhost:" + PORT + "/api/reviews/1");
  console.log("👥 Пользователи: " + USERS_FILE);
  console.log("📁 Товары файл: " + PRODUCTS_FILE);
  console.log("💬 Отзывы файл: " + REVIEWS_FILE);
});
