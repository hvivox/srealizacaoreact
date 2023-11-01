import { Link } from "react-router-dom";
export const About = () => {
  return (
    <div>
      Pagina sobre:
      <ul>
        <li>
          <Link to="/about/aboutList">Lista</Link>
        </li>
        <li>
          <Link to="/about/cadastro">Cadastro</Link>
        </li>
      </ul>
    </div>
  );
};
