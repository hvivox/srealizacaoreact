import { Table, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

interface Folha {
  id: number;
  foco: string;
  dtarealizacao: Date;
  notadia: number;
  //acoes?: any; // Adicione os tipos apropriados se tiver uma estrutura definida para ações
}

export const ListaFolhaView = () => {
  const [listaEntidade, setListaEntidade] = useState<Folha[]>([]);
  const [isErroResposta, setIsErroResposta] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const consultaFolhaList = async () => {
    await axios
      .get("http://localhost:8080/folhas?size=50&sort=foco,asc&status=true")
      .then((response) => {
        setListaEntidade(response.data.content as Folha[]);
        console.log(response.data);
      })
      .catch((error) => {
        setIsErroResposta(isErroResposta);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(isLoading);
      });
  };

  const inativarItem = (record: Folha) => {
    setIsLoading(true);
    const idExcluido = record.id;
    const url = "http://localhost:8080/folhas/" + idExcluido;
    const data = {
      STATUS: 0,
    };

    axios
      .patch(url, data)
      .then((response) => {
        // Removendo o registro inativado do estado
        setListaEntidade((prevLista) => prevLista.filter((item) => item.id !== record.id));

        // Aqui você pode mostrar uma notificação de sucesso. No entanto, o código original usava a biblioteca de notificação do Vue.
        // Se você estiver usando alguma biblioteca de notificação no React, pode invocar aqui.
        console.log(response.data.mensagem);
      })
      .catch((error) => {
        setIsErroResposta(true);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = (record: Folha) => {
    console.log("Editando:", record);
    // Aqui você pode navegar para a tela de edição ou abrir um modal de edição
  };

  const handleInactivate = (record: Folha) => {
    // console.log("Inativando:", record);
    showConfirm(record);
    // Aqui você pode fazer a chamada API para inativar o registro ou abrir uma confirmação
  };

  function showConfirm(record: Folha) {
    Modal.confirm({
      title: `Deseja inativar o item ${record.id}?`,
      content: "Ao inativar este item, ele não estará mais disponível.",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        inativarItem(record);
        console.log(`Item ${record.id} inativado`);
      },
      onCancel() {
        console.log("Ação cancelada");
      },
    });
  }

  // LISTA A CONSULTA AO RENDENIZAR A TELA
  useEffect(() => {
    consultaFolhaList();
  }, []);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Foco ",
      dataIndex: "foco",
      key: "foco",
    },
    {
      title: "Data Entrega",
      dataIndex: "dtarealizacao",
      key: "dtarealizacao",
    },

    {
      title: "Nota",
      dataIndex: "notadia",
      key: "notadia",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (value: string, record: Folha) => (
        <span>
          <button onClick={() => handleEdit(record)}>Editar</button>
          <button onClick={() => handleInactivate(record)} style={{ marginLeft: "10px" }}>
            Inativar
          </button>
        </span>
      ),
    },
  ];
  return (
    <div>
      <Table dataSource={listaEntidade} columns={columns} rowKey={"id"} />
    </div>
  );
};
