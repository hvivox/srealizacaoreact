import { Link } from "react-router-dom";
export const About = () => {
  return (
    <div>
      Pagina sobre:
      <ul>
        <li>
          <Link to="/about/aboutList">Lista</Link>
        </li>
      </ul>
    </div>
  );
};
