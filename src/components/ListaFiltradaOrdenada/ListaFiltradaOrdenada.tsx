import {listaProdutos} from "../../data/listaProdutos.ts";
import {listaEstoque} from "../../data/listaEstoque.ts";
import Modal from 'react-modal';
import {useState} from "react";


export const ListaFiltradaOrdenada = () => {
    /* metodos auxiliares do modal -------------------------------------*/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };//Crie uma função para fechar o modal.
    /* fim metodos auxiliares do modal -------------------------------------*/


    /* filtros para as consultas -------------------------------------*/
    //const lista = listaProdutos.map((produto) => <li>{produto.nome}</li>);
    const listaFiltrada = listaProdutos.filter((produto) => produto.nome != "segundo");


    /*justa da lista de produtos com o estoque*/
    const produtosComEstoque = listaProdutos.map((produto) => ({
        ...produto,
        estoque: listaEstoque.find((item) => item.id === produto.id)?.quantidade || 0,
    }));
    /* fim - filtros para as consultas -------------------------------------*/


    /* ordenação de lista para mover os itens sem estoque para o fima da fila */
    produtosComEstoque.sort((a, b) => {
        if (a.estoque === 0 && b.estoque !== 0) {
            return 1; // Mover a para o final
        } else if (a.estoque !== 0 && b.estoque === 0) {
            return -1; // Mover b para o final
        } else {
            return 0; // Manter a ordem atual
        }
    });


    /*informações que será exibidas no modal*/
    const modalContent = (
        <div>
            <h2>Conteúdo do Modal</h2>

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
                    <li key={produto.id}>{produto.nome} </li>
                ))}
            </ul>
            <hr></hr>
            <ul>
                <span>PERCORRENDO UMA LISTA COM O MAPPING</span>
                {listaEstoque.map((Estoque) => (
                    <li key={Estoque.id}>
                        {Estoque.id} - {Estoque.quantidade}{" "}
                    </li>
                ))}
            </ul>
        </div>
    );


    return (
        <div>
            <button className="btn btn-danger" onClick={handleOpenModal}>Lista Ordenada e Filtrada</button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Exemplo de Modal"
            >
                {modalContent}
                <button onClick={handleCloseModal}>Fechar Modal</button>
            </Modal>


        </div>
    );
}