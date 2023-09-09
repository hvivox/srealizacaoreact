import "bootstrap/dist/css/bootstrap.css"; // Importe o CSS do Bootstrap

type Props = {
  name: string;
  price: number;
  photo: string;
};

export const CardProduct = (props: Props) => {
  const modalCadastro = () => {
    alert("abertura modal");
  };

  return (
    <div className="m-4">
      <h1>{props.name}</h1>
      <button className="btn btn-primary" onClick={modalCadastro}>
        cadastrar
      </button>
    </div>
  );
};
