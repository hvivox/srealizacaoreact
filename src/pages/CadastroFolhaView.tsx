// FolhaEditPage.tsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import { DatePicker, InputNumber } from "antd";
import moment from "moment";

interface Folha {
  id: number;
  foco: string;
  dtarealizacao: Date;
  notadia: number;
}

export const CadastroFolhaView = () => {
  const [folha, setFolha] = useState<Folha | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`http://localhost:8080/folhas/${id}`)
        .then((response) => {
          setFolha(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar a folha", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  // A função para lidar com a mudança na data
  const handleDateChange = (date: moment.Moment | null, dateString: string) => {
    console.log(dateString);
    if (date) {
      setFolha((prevFolha) => {
        if (prevFolha === null) return null;

        // Já que prevFolha não é null, sabemos que as propriedades não serão undefined
        return { ...prevFolha, dtarealizacao: date.toDate() };
      });
    } else {
      // Aqui você pode definir como quer lidar quando a data for removida/limpa
      setFolha((prevFolha) => {
        if (prevFolha === null) return null;

        return { ...prevFolha, dtarealizacao: new Date() }; // ou null, se a data puder ser nula
      });
    }
  };

  const handleNotaChange = (value: number | null) => {
    setFolha((prevFolha) => {
      if (prevFolha === null) return null;

      // Se value for null, defina notadia como um valor padrão, como 0
      return { ...prevFolha, notadia: value ?? 0 };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (folha) {
      setIsLoading(true);
      axios
        .put(`http://localhost:8080/folhas/${folha.id}`, folha)
        .then((response) => {
          navigate("/lista-folha"); // ou para a rota onde está a lista
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Erro ao atualizar a folha", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  if (!folha) return <p>Folha não encontrada ou ID não fornecido</p>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo para 'foco' */}
      <label htmlFor="foco">Foco:</label>
      <input
        id="foco"
        value={folha?.foco ?? ""}
        onChange={(e) => setFolha(folha ? { ...folha, foco: e.target.value } : null)}
        required
      />

      {/* Campo para 'dtarealizacao' */}
      <label htmlFor="dtarealizacao">Data de Realização:</label>
      <DatePicker
        id="dtarealizacao"
        format="DD/MM/YYYY"
        value={folha?.dtarealizacao ? moment(folha.dtarealizacao) : null}
        onChange={handleDateChange}
      />

      {/* Campo para 'notadia' */}
      <label htmlFor="notadia">Nota do Dia:</label>
      <InputNumber
        id="notadia"
        min={0}
        max={10}
        value={folha?.notadia ?? 0}
        onChange={handleNotaChange}
      />

      {/* Botão de salvar */}
      <button type="submit" disabled={isLoading}>
        Salvar
      </button>
    </form>
  );
};
