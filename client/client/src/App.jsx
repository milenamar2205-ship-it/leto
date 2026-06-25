import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("first");

  return (
    <div className="app">
      <h1>Моё React-приложение</h1>

      <div className="menu">
        <button onClick={() => setPage("first")}>Первый лист</button>
        <button onClick={() => setPage("second")}>Второй лист</button>
      </div>

      {page === "first" && (
        <div className="page">
          <h2>Первый лист</h2>
          <p>Это первая страница-заглушка.</p>
        </div>
      )}

      {page === "second" && (
        <div className="page">
          <h2>Второй лист</h2>
          <p>Это вторая страница-заглушка.</p>
        </div>
      )}
    </div>
  );
}

export default App;
