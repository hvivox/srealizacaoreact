import "./App.css";
import { listaProdutos } from "./data/listaProdutos";
import { listaEstoque } from "./data/listaEstoque";
import { BotaoCadastro } from "./components/BotaoCadastro";
import "bootstrap/dist/css/bootstrap.css"; // Importe o CSS do Bootstrap

function App() {
  //const lista = listaProdutos.map((produto) => <li>{produto.nome}</li>);
  const getWeekDay = () => {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(new Date());
  };
  const listaFiltrada = listaProdutos.filter((produto) => produto.nome != "segundo");

  const produtosComEstoque = listaProdutos.map((produto) => ({
    ...produto,
    estoque: listaEstoque.find((item) => item.id === produto.id)?.quantidade || 0,
  }));

  produtosComEstoque.sort((a, b) => {
    if (a.estoque === 0 && b.estoque !== 0) {
      return 1; // Mover a para o final
    } else if (a.estoque !== 0 && b.estoque === 0) {
      return -1; // Mover b para o final
    } else {
      return 0; // Manter a ordem atual
    }
  });

  return (
    <div className="App">
      <div className="container">
        <h3>{getWeekDay()}</h3>
        <BotaoCadastro name="xmogenes" price={10.42} photo="testeeststeste" />
        <BotaoCadastro name="hmsilva" price={20.42} photo="linkfoto" />
        <ul>
          {produtosComEstoque.map((produto) => (
            <li key={produto.id}>
              produto: {produto.nome} --- Quantaidade: {produto.estoque}{" "}
            </li>
          ))}
        </ul>
        <hr />
        <ul>
          <span>LISTA FILTRADA</span>
          {listaFiltrada.map((produto) => (
            <li>{produto.nome} </li>
          ))}
        </ul>
        <hr></hr>
        <ul>
          <span>PERCORRENDO UMA LISTA COM O MAPPING</span>
          {listaEstoque.map((Estoque) => (
            <li>
              {Estoque.id} - {Estoque.quantidade}{" "}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
