import {useState} from "react";
import Modal from "react-modal";

export const ModalPrincipal = ()=> {

    //estado para controlar a abertura e o fechamento do modal.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };//Crie uma função para abrir o modal quando o botão for clicado.
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };//Crie uma função para fechar o modal.


    const modalContent = (
        <div>
            <h2>Conteúdo do Modal</h2>
            {/* Coloque aqui o código que você deseja exibir no modal */}
        </div>
    );

    return(

        <div>
            <button onClick={handleOpenModal}>Abrir Modal</button>
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