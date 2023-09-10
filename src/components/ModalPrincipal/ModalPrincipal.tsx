import React, {useState} from "react";
import Modal from "react-modal";

interface ModalProps{
    nameButtonModal: string;
    children: React.ReactNode;
}


export const ModalPrincipal = ( {nameButtonModal, children}: ModalProps)=> {

    //estado para controlar a abertura e o fechamento do modal.
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };//Crie uma função para abrir o modal quando o botão for clicado.


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };//Crie uma função para fechar o modal.


    return(

        <div>
            <button  className="btn btn-danger" onClick={handleOpenModal}>{nameButtonModal}</button>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="PRODUCT OF CARD"
            >
                {children}
                <button className="btn btn-danger"  onClick={handleCloseModal}>Fechar Modal</button>
            </Modal>

        </div>

    );
}