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
const CART_FILE = path.join(__dirname, "cart.json");
const SUPPORT_CHATS_FILE = path.join(__dirname, "support_chats.json");

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

function readCart() {
  return readJsonFile(CART_FILE);
}

function saveCart(cart) {
  saveJsonFile(CART_FILE, cart);
}

function readSupportChats() {
  return readJsonFile(SUPPORT_CHATS_FILE);
}

function saveSupportChats(chats) {
  saveJsonFile(SUPPORT_CHATS_FILE, chats);
}

function getNextId(items) {
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function getNextMessageId(messages) {
  return messages.length > 0
    ? Math.max(...messages.map((message) => message.id)) + 1
    : 1;
}

function generateNickname(login, id) {
  return login + "_" + id;
}

app.get("/", function (request, response) {
  response.send("Сервер работает ✅");
});

// ========== ПОЛЬЗОВАТЕЛИ ==========

app.post("/api/register", function (request, response) {
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

  const newId = getNextId(users);
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: newId,
    login: login,
    password: hashedPassword,
    email: email,
    nickname: generateNickname(login, newId),
    avatar: "",
    favorites: [],
    coins: 0,
    registeredAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return response.json({
    success: true,
    message: "Аккаунт создан. Теперь можно войти",
    user: {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      nickname: newUser.nickname,
      avatar: newUser.avatar,
      favorites: newUser.favorites,
      coins: newUser.coins,
      registeredAt: newUser.registeredAt,
    },
  });
});

app.post("/api/login", function (request, response) {
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
      coins: user.coins || 0,
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
      coins: user.coins || 0,
      registeredAt: user.registeredAt,
    },
  });
});

// ========== МОНЕТЫ ==========

app.get("/api/coins/:userId", function (request, response) {
  const userId = Number(request.params.userId);
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
    coins: user.coins || 0
  });
});

app.post("/api/coins/add", function (request, response) {
  const { userId, amount, reason } = request.body;
  
  console.log("💰 Запрос на добавление монет:", { userId, amount, reason });
  
  if (!userId || !amount || amount <= 0) {
    return response.status(400).json({
      success: false,
      message: "Неверные данные"
    });
  }
  
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден"
    });
  }
  
  user.coins = (user.coins || 0) + amount;
  saveUsers(users);
  
  console.log(`💰 +${amount} монет пользователю ${user.login} (${reason})`);
  
  return response.json({
    success: true,
    message: `Добавлено ${amount} монет`,
    coins: user.coins
  });
});

app.post("/api/coins/spend", function (request, response) {
  const { userId, amount, promoCode } = request.body;
  
  if (!userId || !amount || amount <= 0) {
    return response.status(400).json({
      success: false,
      message: "Неверные данные"
    });
  }
  
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден"
    });
  }
  
  if ((user.coins || 0) < amount) {
    return response.status(400).json({
      success: false,
      message: "Недостаточно монет"
    });
  }
  
  user.coins = (user.coins || 0) - amount;
  saveUsers(users);
  
  console.log(`💸 -${amount} монет у пользователя ${user.login} (промокод: ${promoCode})`);
  
  return response.json({
    success: true,
    message: `Списано ${amount} монет. Промокод: ${promoCode}`,
    coins: user.coins,
    promoCode: promoCode
  });
});

// ========== ИЗБРАННОЕ ==========

app.get("/api/favorites/:userId", function (request, response) {
  const userId = Number(request.params.userId);
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
  const { title, price, category, universe, description, images, isNew } = request.body;

  if (!title || !price || !category || !universe) {
    return response.status(400).json({
      success: false,
      message: "Заполните название, цену, категорию и вселенную",
    });
  }

  const products = readProducts();

  const newId = getNextId(products);

  const newProduct = {
    id: newId,
    title: title,
    price: Number(price),
    category: category,
    universe: universe,
    description: description || "",
    images: images || [],
    rating: 0,
    reviewsCount: 0,
    isNew: isNew || false,
  };

  products.push(newProduct);
  saveProducts(products);

  return response.json({
    success: true,
    message: "Товар добавлен",
    product: newProduct,
  });
});

app.put("/api/products/:id", function (request, response) {
  const productId = Number(request.params.id);
  const { title, price, category, universe, description, images, isNew } = request.body;

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
  if (images !== undefined) product.images = images;
  if (isNew !== undefined) product.isNew = isNew;

  saveProducts(products);

  return response.json({
    success: true,
    message: "Товар обновлён",
    product: product,
  });
});

app.delete("/api/products/:id", function (request, response) {
  const productId = Number(request.params.id);

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

  productReviews.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  return response.json({
    success: true,
    reviews: productReviews,
  });
});

app.post("/api/reviews", function (request, response) {
  const { productId, userId, userName, rating, text } = request.body;

  if (!productId || !userId || !userName || !rating || !text) {
    return response.status(400).json({
      success: false,
      message: "Заполните все поля",
    });
  }

  if (rating < 1 || rating > 5) {
    return response.status(400).json({
      success: false,
      message: "Рейтинг должен быть от 1 до 5",
    });
  }

  const users = readUsers();
  const user = users.find(function (u) {
    return u.id === userId;
  });

  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден",
    });
  }

  const products = readProducts();
  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (!product) {
    return response.status(404).json({
      success: false,
      message: "Товар не найден",
    });
  }

  const reviews = readReviews();
  const existingReview = reviews.find(function (review) {
    return review.productId === productId && review.userId === userId;
  });

  if (existingReview) {
    return response.status(409).json({
      success: false,
      message: "Вы уже оставляли отзыв на этот товар",
    });
  }

  const newId = getNextId(reviews);

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

  // Обновляем рейтинг товара
  const productReviews = reviews.filter(function (review) {
    return review.productId === productId;
  });

  const totalRating = productReviews.reduce(function (sum, review) {
    return sum + review.rating;
  }, 0);

  product.rating = Math.round((totalRating / productReviews.length) * 10) / 10;
  product.reviewsCount = productReviews.length;

  saveProducts(products);

  // ===== НАЧИСЛЯЕМ МОНЕТЫ ЗА ОТЗЫВ =====
  user.coins = (user.coins || 0) + 50;
  saveUsers(users);
  console.log(`💰 +50 монет пользователю ${user.login} за отзыв`);

  return response.json({
    success: true,
    message: "Отзыв добавлен! +50 монет",
    review: newReview,
    coins: user.coins
  });
});

app.delete("/api/reviews/:id", function (request, response) {
  const reviewId = Number(request.params.id);
  const { userId } = request.body;

  if (!userId) {
    return response.status(400).json({
      success: false,
      message: "Не указан ID пользователя",
    });
  }

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

  const productId = review.productId;
  reviews.splice(reviewIndex, 1);
  saveReviews(reviews);

  // Обновляем рейтинг товара
  const products = readProducts();
  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (product) {
    const productReviews = reviews.filter(function (r) {
      return r.productId === productId;
    });

    if (productReviews.length > 0) {
      const totalRating = productReviews.reduce(function (sum, r) {
        return sum + r.rating;
      }, 0);
      product.rating = Math.round((totalRating / productReviews.length) * 10) / 10;
      product.reviewsCount = productReviews.length;
    } else {
      product.rating = 0;
      product.reviewsCount = 0;
    }

    saveProducts(products);
  }

  return response.json({
    success: true,
    message: "Отзыв удалён",
  });
});

// ========== КОРЗИНА ==========

app.get("/api/cart/:userId", function (request, response) {
  const userId = Number(request.params.userId);
  const cart = readCart();
  const userCart = cart.filter(function (item) {
    return item.userId === userId;
  });

  return response.json({
    success: true,
    cart: userCart,
  });
});

app.post("/api/cart", function (request, response) {
  const { userId, productId, quantity } = request.body;

  if (!userId || !productId) {
    return response.status(400).json({
      success: false,
      message: "Не указан пользователь или товар",
    });
  }

  const users = readUsers();
  const user = users.find(function (u) {
    return u.id === userId;
  });

  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден",
    });
  }

  const products = readProducts();
  const product = products.find(function (p) {
    return p.id === productId;
  });

  if (!product) {
    return response.status(404).json({
      success: false,
      message: "Товар не найден",
    });
  }

  const cart = readCart();
  const existingItem = cart.find(function (item) {
    return item.userId === userId && item.productId === productId;
  });

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.push({
      id: getNextId(cart),
      userId: userId,
      productId: productId,
      quantity: quantity || 1,
    });
  }

  saveCart(cart);

  const userCart = cart.filter(function (item) {
    return item.userId === userId;
  });

  return response.json({
    success: true,
    message: "Товар добавлен в корзину",
    cart: userCart,
  });
});

app.put("/api/cart", function (request, response) {
  const { userId, productId, quantity } = request.body;

  if (!userId || !productId || quantity === undefined) {
    return response.status(400).json({
      success: false,
      message: "Не указаны все данные",
    });
  }

  const cart = readCart();
  const itemIndex = cart.findIndex(function (item) {
    return item.userId === userId && item.productId === productId;
  });

  if (itemIndex === -1) {
    return response.status(404).json({
      success: false,
      message: "Товар не найден в корзине",
    });
  }

  if (quantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = quantity;
  }

  saveCart(cart);

  const userCart = cart.filter(function (item) {
    return item.userId === userId;
  });

  return response.json({
    success: true,
    message: "Корзина обновлена",
    cart: userCart,
  });
});

app.delete("/api/cart", function (request, response) {
  const { userId, productId } = request.body;

  if (!userId || !productId) {
    return response.status(400).json({
      success: false,
      message: "Не указаны все данные",
    });
  }

  const cart = readCart();
  const filteredCart = cart.filter(function (item) {
    return !(item.userId === userId && item.productId === productId);
  });

  if (filteredCart.length === cart.length) {
    return response.status(404).json({
      success: false,
      message: "Товар не найден в корзине",
    });
  }

  saveCart(filteredCart);

  const userCart = filteredCart.filter(function (item) {
    return item.userId === userId;
  });

  return response.json({
    success: true,
    message: "Товар удалён из корзины",
    cart: userCart,
  });
});

// ========== СЛУЖБА ПОДДЕРЖКИ ==========

app.get("/api/support/user/:userId", function (request, response) {
  const userId = Number(request.params.userId);
  const chats = readSupportChats();

  const chat = chats.find(function (item) {
    return item.userId === userId && item.status !== "deleted";
  });

  return response.json({
    success: true,
    chat: chat || null,
  });
});

app.post("/api/support/message", function (request, response) {
  const { user, text, file } = request.body;

  if (!user || !user.id) {
    return response.status(400).json({
      success: false,
      message: "Пользователь не найден",
    });
  }

  if ((!text || !text.trim()) && !file) {
    return response.status(400).json({
      success: false,
      message: "Сообщение пустое",
    });
  }

  const chats = readSupportChats();

  let chat = chats.find(function (item) {
    return item.userId === user.id && item.status !== "deleted";
  });

  if (!chat) {
    chat = {
      id: getNextId(chats),
      userId: user.id,
      userLogin: user.login,
      userEmail: user.email || "",
      userNickname: user.nickname || user.login,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminUnread: 0,
      userUnread: 0,
      isNew: true,
      messages: [],
    };

    chats.push(chat);
  }

  const newMessage = {
    id: getNextMessageId(chat.messages),
    sender: "user",
    text: text || "",
    file: file || null,
    createdAt: new Date().toISOString(),
  };

  chat.messages.push(newMessage);
  chat.adminUnread += 1;
  chat.updatedAt = new Date().toISOString();

  saveSupportChats(chats);

  return response.json({
    success: true,
    message: "Сообщение отправлено",
    chat: chat,
  });
});

app.get("/api/support/admin/chats", function (request, response) {
  const chats = readSupportChats().filter(function (chat) {
    return chat.status !== "deleted";
  });

  chats.sort(function (a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return response.json({
    success: true,
    chats: chats,
  });
});

app.get("/api/support/admin/chats/:chatId", function (request, response) {
  const chatId = Number(request.params.chatId);
  const chats = readSupportChats();

  const chat = chats.find(function (item) {
    return item.id === chatId && item.status !== "deleted";
  });

  if (!chat) {
    return response.status(404).json({
      success: false,
      message: "Чат не найден",
    });
  }

  chat.adminUnread = 0;
  chat.isNew = false;

  saveSupportChats(chats);

  return response.json({
    success: true,
    chat: chat,
  });
});

app.post("/api/support/admin-message", function (request, response) {
  const { chatId, text, file } = request.body;

  if ((!text || !text.trim()) && !file) {
    return response.status(400).json({
      success: false,
      message: "Сообщение пустое",
    });
  }

  const chats = readSupportChats();

  const chat = chats.find(function (item) {
    return item.id === Number(chatId) && item.status !== "deleted";
  });

  if (!chat) {
    return response.status(404).json({
      success: false,
      message: "Чат не найден",
    });
  }

  const newMessage = {
    id: getNextMessageId(chat.messages),
    sender: "admin",
    text: text || "",
    file: file || null,
    createdAt: new Date().toISOString(),
  };

  chat.messages.push(newMessage);
  chat.userUnread += 1;
  chat.updatedAt = new Date().toISOString();

  saveSupportChats(chats);

  return response.json({
    success: true,
    message: "Ответ отправлен",
    chat: chat,
  });
});

app.put("/api/support/user/:chatId/read", function (request, response) {
  const chatId = Number(request.params.chatId);
  const chats = readSupportChats();

  const chat = chats.find(function (item) {
    return item.id === chatId && item.status !== "deleted";
  });

  if (!chat) {
    return response.status(404).json({
      success: false,
      message: "Чат не найден",
    });
  }

  chat.userUnread = 0;
  saveSupportChats(chats);

  return response.json({
    success: true,
    chat: chat,
  });
});

app.put("/api/support/:chatId/finish", function (request, response) {
  const chatId = Number(request.params.chatId);
  const chats = readSupportChats();

  const chat = chats.find(function (item) {
    return item.id === chatId && item.status !== "deleted";
  });

  if (!chat) {
    return response.status(404).json({
      success: false,
      message: "Чат не найден",
    });
  }

  chat.status = "finished";
  chat.updatedAt = new Date().toISOString();

  saveSupportChats(chats);

  return response.json({
    success: true,
    message: "Диалог завершён",
    chat: chat,
  });
});

app.delete("/api/support/:chatId", function (request, response) {
  const chatId = Number(request.params.chatId);
  const chats = readSupportChats();

  const filteredChats = chats.filter(function (chat) {
    return chat.id !== chatId;
  });

  saveSupportChats(filteredChats);

  return response.json({
    success: true,
    message: "Чат удалён",
  });
});

// В server.js добавим новый файл для хранения купленных промокодов
const PROMO_PURCHASES_FILE = path.join(__dirname, "promo_purchases.json");

function readPromoPurchases() {
  if (!fs.existsSync(PROMO_PURCHASES_FILE)) {
    fs.writeFileSync(PROMO_PURCHASES_FILE, "[]", "utf-8");
  }
  const data = fs.readFileSync(PROMO_PURCHASES_FILE, "utf-8");
  if (!data.trim()) return [];
  return JSON.parse(data);
}

function savePromoPurchases(purchases) {
  fs.writeFileSync(PROMO_PURCHASES_FILE, JSON.stringify(purchases, null, 2), "utf-8");
}

// Словарь всех доступных промокодов
const PROMO_DISCOUNTS = {
  RETRO5: 0.05,
  RETRO10: 0.10,
  RETRO15: 0.15,
  COINS5: 0.05,
  COINS10: 0.10,
  COINS30: 0.30
};

// Получить все промокоды пользователя
app.get("/api/promos/:userId", function (request, response) {
  const userId = Number(request.params.userId);
  const purchases = readPromoPurchases();
  const userPromos = purchases.filter(p => p.userId === userId && !p.used);
  
  return response.json({
    success: true,
    promos: userPromos
  });
});

// Применить промокод
app.post("/api/promos/apply", function (request, response) {
  const { userId, promoCode } = request.body;
  
  const purchases = readPromoPurchases();
  const purchase = purchases.find(p => 
    p.userId === userId && 
    p.promoCode === promoCode && 
    !p.used
  );
  
  if (!purchase) {
    return response.status(404).json({
      success: false,
      message: "Промокод не найден или уже использован"
    });
  }
  
  // Проверяем, существует ли такой промокод
  if (!PROMO_DISCOUNTS[promoCode]) {
    return response.status(400).json({
      success: false,
      message: "Неверный промокод"
    });
  }
  
  // Отмечаем как использованный
  purchase.used = true;
  purchase.usedAt = new Date().toISOString();
  savePromoPurchases(purchases);
  
  return response.json({
    success: true,
    message: "Промокод применён",
    discount: PROMO_DISCOUNTS[promoCode],
    promoCode: promoCode
  });
});

// Обновляем покупку промокода - добавляем сохранение в список покупок
app.post("/api/coins/spend", function (request, response) {
  const { userId, amount, promoCode } = request.body;
  
  if (!userId || !amount || amount <= 0) {
    return response.status(400).json({
      success: false,
      message: "Неверные данные"
    });
  }
  
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return response.status(404).json({
      success: false,
      message: "Пользователь не найден"
    });
  }
  
  if ((user.coins || 0) < amount) {
    return response.status(400).json({
      success: false,
      message: "Недостаточно монет"
    });
  }
  
  // Списываем монеты
  user.coins = (user.coins || 0) - amount;
  saveUsers(users);
  
  // Сохраняем купленный промокод
  const purchases = readPromoPurchases();
  const newPurchase = {
    id: purchases.length > 0 ? Math.max(...purchases.map(p => p.id)) + 1 : 1,
    userId: userId,
    promoCode: promoCode,
    discount: PROMO_DISCOUNTS[promoCode] || 0.05,
    purchasedAt: new Date().toISOString(),
    used: false,
    usedAt: null
  };
  purchases.push(newPurchase);
  savePromoPurchases(purchases);
  
  console.log(`💸 -${amount} монет у пользователя ${user.login} (промокод: ${promoCode})`);
  
  return response.json({
    success: true,
    message: `Списано ${amount} монет. Промокод: ${promoCode}`,
    coins: user.coins,
    promoCode: promoCode,
    purchase: newPurchase
  });
});

// Получить список купленных промокодов пользователя
app.get("/api/promos/user/:userId", function (request, response) {
  const userId = Number(request.params.userId);
  const purchases = readPromoPurchases();
  const userPromos = purchases.filter(p => p.userId === userId);
  
  return response.json({
    success: true,
    promos: userPromos
  });
});

// ========== ЗАПУСК ==========

app.listen(PORT, function () {
  console.log("🚀 Сервер запущен на порту " + PORT);
  console.log("🔗 http://localhost:" + PORT);
  console.log("");
  console.log("💰 МОНЕТЫ:");
  console.log("  GET  /api/coins/:userId");
  console.log("  POST /api/coins/add");
  console.log("  POST /api/coins/spend");
  console.log("");
  console.log("📦 ТОВАРЫ: /api/products");
  console.log("💬 ОТЗЫВЫ: /api/reviews");
  console.log("❤️ ИЗБРАННОЕ: /api/favorites");
  console.log("🛒 КОРЗИНА: /api/cart");
});
