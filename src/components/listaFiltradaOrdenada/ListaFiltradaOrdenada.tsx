import {listaProdutos} from "../../data/listaProdutos.ts";
import {listaEstoque} from "../../data/listaEstoque.ts";

export const ListaFiltradaOrdenada = () => {
    //const lista = listaProdutos.map((produto) => <li>{produto.nome}</li>);
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
        <div>
            <ul>
                {produtosComEstoque.map((produto) => (
                    <li key={produto.id}>
                        produto: {produto.nome} --- Quantaidade: {produto.estoque}{" "}
                    </li>
                ))}
            </ul>
            <hr/>
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
    );
}