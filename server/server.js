const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const usersFile = path.join(__dirname, "users.json");

function loadUsers() {
  try {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

let users = loadUsers();

app.post("/api/register", (req, res) => {
  const { login, password, email } = req.body;

  const userExists = users.find((user) => user.login === login);

  if (userExists) {
    return res.json({
      success: false,
      message: "Пользователь уже существует",
    });
  }

const newUser = {
  id: users.length + 1,
  login,
  password,
  nickname: login,
  avatar: "",
  email,
  registeredAt: new Date().toISOString(),
};

  users.push(newUser);
  saveUsers(users);

  res.json({
    success: true,
    message: "Регистрация успешна",
  });
});

app.post("/api/login", (req, res) => {
  const { login, password } = req.body;

  const user = users.find(
    (u) => u.login === login && u.password === password
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
    user,
  });
});

app.put("/api/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nickname, avatar } = req.body;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.json({
      success: false,
      message: "Пользователь не найден",
    });
  }

  user.nickname = nickname;
  user.avatar = avatar;

  saveUsers(users);

  res.json({
    success: true,
    message: "Профиль сохранён",
    user,
  });
});

app.listen(3001, () => {
  console.log("Сервер запущен на порту 3001");
});

