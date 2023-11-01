import { ButtonDownload } from "../components/ButtonDownload/ButtonDownload";
import { CardProduct } from "../components/CardProduct/cardProduct";
import { FildInsert } from "../components/FieldInsert/FildInsert";
import { FormProduto } from "../components/FormProduto/FormProduto";
import { ListaFiltradaOrdenada } from "../components/ListaFiltradaOrdenada/ListaFiltradaOrdenada";
import { ModalPrincipal } from "../components/ModalPrincipal/ModalPrincipal";

export const ExemplosComponent = () => {
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
    <div>
      {" "}
      <ButtonDownload />
      <FormProduto />
      <ModalPrincipal nameButtonModal="Lista de cartões">
        <CardProduct name="xmogenes" price={10.42} photo="testeeststeste" />
        <CardProduct name="hmsilva" price={18.42} photo="link da imagem" />
      </ModalPrincipal>
      <ListaFiltradaOrdenada />
      <FildInsert onEnter={handleAddTask} />
    </div>
  );
};
