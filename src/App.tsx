import "./App.css";

import { MainRoutes } from "./routes/MainRoutes.tsx";
import "antd/dist/antd.css";
import {Navbar} from "./pages/Navbar/Navbar.tsx";

function App() {
  const getWeekDay = () => {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date());
  };

  return (
    <div className="App">
      <div className="container">
        <h3>{getWeekDay()}</h3>
        <Navbar/>
        <header>
          <h3>SISTEMA Realização</h3>
        </header>
        <hr />
        <div>
          <MainRoutes />
        </div>
        <footer>Todos os direitos reservados</footer>
      </div>
    </div>
  );
}

export default App;
