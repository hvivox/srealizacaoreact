import axios from "axios";
import { DatePicker } from "antd";
import { Moment } from "moment";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { useState } from "react";

export const ButtonDownload = () => {
  // const [data, setData] = useState<any>(null); // Substitua 'any' pelo tipo de dados que você está esperando
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { RangePicker } = DatePicker;

  const downloadExcel = async () => {
    try {
      const response = await axios.get("http://localhost:8080/folhas/excel", {
        responseType: "blob",
        params: {
          startDate,
          endDate,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_de_vendas.xls");
      document.body.appendChild(link);
      link.click();
      // link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Não foi possível fazer o download, tente novamente mais tarde!", error);
    }
  };

  const onDateChange = (
    dates: [Moment | null, Moment | null] | null,
    dateStrings: [string, string]
  ) => {
    /*campo inicio e fim preenchidos */
    if (dates) {
      setStartDate(dateStrings[0]);
      setEndDate(dateStrings[1]);

      /*
      console.log("dates: " + dates);
      const startDate = dateStrings[0];
      const endDate = dateStrings[1];
      console.log(startDate);
      console.log(endDate);
      */
    }
  };

  return (
    <div className="list-container">
      <RangePicker onChange={onDateChange} />
      <button className="btn btn-pdf">
        <FaFilePdf />
      </button>
      <button className="btn btn-excel" onClick={downloadExcel}>
        <FaFileExcel />
      </button>
    </div>
  );
};

// ...

// ...
//https://stackoverflow.com/questions/68890870/how-to-download-excel-in-response-from-api-react-js
