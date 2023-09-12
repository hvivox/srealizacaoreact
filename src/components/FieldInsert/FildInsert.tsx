import { useState, KeyboardEvent } from "react";
import { ModalPrincipal } from "../ModalPrincipal/ModalPrincipal";

type Props = {
  onEnter: (taskName: string) => void;
};

export const FildInsert = ({ onEnter }: Props) => {
  const [inputText, setInputText] = useState("");
  const [modalText, setModalText] = useState(""); // Estado para o texto do modal
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Enter" && inputText !== "") {
      onEnter(inputText);
      setInputText("");
      setModalText(inputText); // Defina o texto do modal quando o Enter é pressionado
    }
  };

  const handleButtonClick = () => {
    if (inputText.trim() !== "") {
      onEnter(inputText);
      setInputText("");
      setModalText(inputText); // Defina o texto do modal quando o Enter é pressionado
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Adicione uma tarefa"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <button onClick={handleButtonClick}>➕</button>

      <ModalPrincipal nameButtonModal="Adicionar Tarefa">{modalText}</ModalPrincipal>
    </div>
  );
};
