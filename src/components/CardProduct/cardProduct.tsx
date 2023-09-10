//import "bootstrap/dist/css/bootstrap.css"; // Importe o CSS do Bootstrap
import axios from 'axios';

type Props = {
    name: string;
    price: number;
    photo: string;
};

export const CardProduct = (props: Props) => {
    const modalCadastro = () => {
        alert("abertura modal");
    };

    const handleGetPosts = () => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then( (response)=>{
                console.log(response.data);
            });
    }

    return (
        <div className="m-4">
            <h1>{props.name}</h1>
            <button className="btn btn-primary" onClick={modalCadastro}>
                cadastrar
            </button>

            <button className="btn btn-primary" onClick={handleGetPosts}>
                Pegar posts
            </button>

        </div>
    );
};
