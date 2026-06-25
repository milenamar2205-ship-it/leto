import FirstPage from "./pages/FirstPage";
import SecondPage from "./pages/SecondPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Моё React-приложение</h1>

      <div className="pages">
        <FirstPage />
        <SecondPage />
      </div>
    </div>
  );
}

export default App;
