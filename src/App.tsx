import "./App.css";
import { CardProduct } from "./components/CardProduct/cardProduct.tsx";

import {ListaFiltradaOrdenada} from "./components/listaFiltradaOrdenada/ListaFiltradaOrdenada.tsx"; // Importe o CSS do Bootstrap

function App() {
  const getWeekDay = () => {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date());
  };


  return (
    <div className="App">
      <div className="container">
        <h3>{getWeekDay()}</h3>
        <CardProduct name="xmogenes" price={10.42} photo="testeeststeste" />
        <CardProduct name="hmsilva" price={20.42} photo="linkfoto" />
       <ListaFiltradaOrdenada/>
      </div>
    </div>
  );
}

export default App;
