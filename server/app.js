const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

const users = [];

app.use(cors());
app.use(express.json());

app.get("/", function (request, response) {
  response.send("Сервер работает");
});

app.post("/api/register", function (request, response) {
  const { login, password } = request.body;

  if (!login || !password) {
    return response.status(400).json({
      success: false,
      message: "Введите логин и пароль",
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

  const existingUser = users.find(function (user) {
    return user.login === login;
  });

  if (existingUser) {
    return response.status(409).json({
      success: false,
      message: "Пользователь с таким логином уже существует",
    });
  }

  users.push({
    login: login,
    password: password,
  });

  return response.json({
    success: true,
    message: "Аккаунт создан. Теперь можно войти",
    user: login,
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

  const user = users.find(function (item) {
    return item.login === login && item.password === password;
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
    user: user.login,
  });
});

app.listen(PORT, function () {
  console.log("Сервер запущен: http://localhost:" + PORT);
});
