// SheetEditPage.tsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import { DatePicker, InputNumber } from "antd";
import moment from "moment";

interface Sheet {
  id: number;
  focus: string;
  realizationDate: Date;
  dayNote: number;
}

export const SheetRegisterView = () => {
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`http://localhost:8080/sheets/${id}`)
        .then((response) => {
          setSheet(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar folha", error);
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
      setSheet((prevSheet) => {
        if (prevSheet === null) return null;

        // Já que prevSheet não é null, sabemos que as propriedades não serão undefined
        return { ...prevSheet, realizationDate: date.toDate() };
      });
    } else {
      // Aqui você pode definir como quer lidar quando a data for removida/limpa
      setSheet((prevSheet) => {
        if (prevSheet === null) return null;

        return { ...prevSheet, realizationDate: new Date() }; // ou null, se a data puder ser nula
      });
    }
  };

  const handleNotaChange = (value: number | null) => {
    setSheet((prevSheet) => {
      if (prevSheet === null) return null;

      // Se value for null, defina notadia como um valor padrão, como 0
      return { ...prevSheet, dayNote: value ?? 0 };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sheet) {
      setIsLoading(true);
      axios
        .put(`http://localhost:8080/sheets/${sheet.id}`, sheet)
        .then((response) => {
          navigate("/sheet-list"); // ou para a rota onde está a lista
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Erro ao atualizar a sheet", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  if (!sheet) return <p>Folha não encontrada ou ID não fornecido</p>;

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo para 'foco' */}
      <label htmlFor="focus">Foco:</label>
      <input
        id="focus"
        value={sheet?.focus ?? ""}
        onChange={(e) => setSheet(sheet ? { ...sheet, focus: e.target.value } : null)}
        required
      />

      {/* Campo para 'dtarealizacao' */}
      <label htmlFor="realizationDate">Data de Realização:</label>
      <DatePicker
        id="realizationDate"
        format="DD/MM/YYYY"
        value={sheet?.realizationDate ? moment(sheet.realizationDate) : null}
        onChange={handleDateChange}
      />

      {/* Campo para 'notadia' */}
      <label htmlFor="dayNote">Nota do Dia:</label>
      <InputNumber
        id="dayNote"
        min={0}
        max={10}
        value={sheet?.dayNote ?? 0}
        onChange={handleNotaChange}
      />

      {/* Botão de salvar */}
      <button type="submit" disabled={isLoading}>
        Salvar
      </button>
    </form>
  );
};
