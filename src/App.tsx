import "./App.css";
import { CardProduct } from "./components/CardProduct/cardProduct.tsx";
import { FildInsert } from "./components/FieldInsert/FildInsert.tsx";
import { ListaFiltradaOrdenada } from "./components/ListaFiltradaOrdenada/ListaFiltradaOrdenada.tsx";
import { ModalPrincipal } from "./components/ModalPrincipal/ModalPrincipal.tsx"; // Importe o CSS do Bootstrap

function App() {
  const getWeekDay = () => {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date());
  };

  const handleAddTask = (taskName: string) => {
    alert(taskName);
    /* let newList = [...list];
      newList.push({
        id: list.length + 1,
        name: taskName,
        done: false,
      });
      setList(newList);*/
  };

  return (
    <div className="App">
      <div className="container">
        <h3>{getWeekDay()}</h3>
        <ModalPrincipal nameButtonModal="Lista de cartões">
          <CardProduct name="xmogenes" price={10.42} photo="testeeststeste" />
          <CardProduct name="hmsilva" price={18.42} photo="link da imagem" />
        </ModalPrincipal>

        <ListaFiltradaOrdenada />

        <FildInsert onEnter={handleAddTask} />
      </div>
    </div>
  );
}

export default App;
