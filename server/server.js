const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

app.post("/api/register", (req, res) => {
  const { login, password } = req.body;

  const userExists = users.find((user) => user.login === login);

  if (userExists) {
    return res.json({
      success: false,
      message: "Пользователь уже существует",
    });
  }

  users.push({ login, password });

  res.json({
    success: true,
    message: "Регистрация успешна",
  });
});

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;

  const user = users.find(
    (user) =>
      user.login === login &&
      user.password === password
  );

  if (!user) {
    return res.json({
      success: false,
      message: "Неверный логин или пароль",
    });
  }

  res.json({
    success: true,
    message: "Вход выполнен",
    user: user.login,
  });
});

app.listen(3001, () => {
  console.log("Сервер запущен на порту 3001");
});



