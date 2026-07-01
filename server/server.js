const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3001;

const USERS_FILE = path.join(__dirname, "users.json");
const PRODUCTS_FILE = path.join(__dirname, "products.json");
const SUPPORT_CHATS_FILE = path.join(__dirname, "support_chats.json");
app.use(cors());
app.use(express.json({ limit: "10mb" }));

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }

  const data = fs.readFileSync(filePath, "utf-8");

  if (!data.trim()) {
    return [];
  }

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
  response.send("Сервер работает");
});

/* =========================
   ПОЛЬЗОВАТЕЛИ
========================= */

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

  const newId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: newId,
    login: login,
    password: hashedPassword,
    email: email,
    nickname: generateNickname(login, newId),
    avatar: "",
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
      registeredAt: user.registeredAt,
    },
  });
});

/* =========================
   ТОВАРЫ
========================= */

app.get("/api/products", function (request, response) {
  const products = readProducts();

  return response.json({
    success: true,
    products: products,
  });
});

app.post("/api/products", function (request, response) {
  const { title, price, category, universe, description, image } = request.body;

  if (!title || !price || !category || !universe) {
    return response.status(400).json({
      success: false,
      message: "Заполните название, цену, категорию и вселенную",
    });
  }

  const products = readProducts();

  const newId =
    products.length > 0
      ? Math.max(...products.map((product) => product.id)) + 1
      : 1;

  const newProduct = {
    id: newId,
    title: title,
    price: Number(price),
    category: category,
    universe: universe,
    description: description || "",
    image: image || "",
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
  const { title, price, category, universe, description, image } = request.body;

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

  if (title !== undefined) {
    product.title = title;
  }

  if (price !== undefined) {
    product.price = Number(price);
  }

  if (category !== undefined) {
    product.category = category;
  }

  if (universe !== undefined) {
    product.universe = universe;
  }

  if (description !== undefined) {
    product.description = description;
  }

  if (image !== undefined) {
    product.image = image;
  }

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

/* =========================
   СЛУЖБА ПОДДЕРЖКИ
========================= */

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

app.listen(PORT, function () {
  console.log("Сервер запущен на порту " + PORT);
  console.log("Проверка сервера: http://localhost:" + PORT);
  console.log("Товары: http://localhost:" + PORT + "/api/products");
});
