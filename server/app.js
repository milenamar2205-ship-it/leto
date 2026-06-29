const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

const USERS_FILE = path.join(__dirname, "users.json");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf-8");
  }

  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function generateNickname(login, id) {
  return login + "_" + id;
}

app.get("/", function (request, response) {
  response.send("Сервер работает");
});

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

if (email) {
  const existingEmail = users.find(function (user) {
    return user.email === email;
  });

  if (existingEmail) {
    return response.status(409).json({
      success: false,
      message: "Пользователь с такой почтой уже существует",
    });
  }
}

  const newId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const newUser = {
    id: newId,
    login,
    password,
    email: email || "",
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
      nickname: newUser.nickname || newUser.login,
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
      message: "Введите логин и пароль",
    });
  }

  const users = readUsers();

  const user = users.find(function (item) {
  return (
    (item.login === login || item.email === login) &&
    item.password === password
  );
});
  if (!user) {
    return response.status(401).json({
      success: false,
      message: "Неверный логин или пароль",
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

app.listen(PORT, function () {
  console.log("Сервер запущен: http://localhost:" + PORT);
});
