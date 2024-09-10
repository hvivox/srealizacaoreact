import "./App.css";

import { MainRoutes } from "./routes/MainRoutes.tsx";
import "antd/dist/antd.css";
import { Navbar } from "./pages/Navbar/Navbar.tsx";

function App() {
  return (
    <div className="App">
      <div className="container">
        <Navbar />

        <div>
          <MainRoutes />
        </div>
        <footer>Todos os direitos reservados</footer>
      </div>
    </div>
  );
}

export default App;
