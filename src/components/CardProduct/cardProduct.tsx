//import "bootstrap/dist/css/bootstrap.css"; // Importe o CSS do Bootstrap
import {api} from "../../utils/api.ts";
import {useEffect, useState} from "react";

type Props = {
    name: string;
    price: number;
    photo: string;
};

interface Product {
    userId: number;
    id: number;
    title: string;
    body: string;
}


export const CardProduct = (props: Props) => {
    const [Product, setProduct] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    //INSERE DADOS NO COMPONENTE NO MOMENTO DA INICIALIZAÇÃO DO MESMO
    useEffect( () => {
        /*async  function fetchData(){
            const _products = await handleGetPosts();
            setProduct(_products);
        }*/


        //CICLO DE VIDA: utilizado para carregar o objeto no momento da inicialização
        async function fetchData() {
            try {
                const response = await api.get<Product[]>('/posts');
                setProduct(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setIsLoading(false);
            }
        }
        fetchData()
    }, [])


    if (isLoading) {
        return <div>Carregando...</div>;
    }


   /* const handleGetPosts = () => {
        api.get<Product[]>('/posts')
            .then((response) => {
                setProduct(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar dados:', error);
                setIsLoading(false);
            });
    }
*/

    const modalCadastro = () => {
        alert("abertura modal");
    };


    return (
        <div className="m-4">

            <div>
                <h2>Dados da API:</h2>
                <ul>
                    {Product.map((item) => (
                        <li key={item.id} >{item.title} | {item.body}</li>
                    ))}
                </ul>
            </div>

            <hr/>

            <h1>{props.name}</h1>
            <button className="btn btn-primary" onClick={modalCadastro}>
                cadastrar
            </button>



        </div>
    );
};
