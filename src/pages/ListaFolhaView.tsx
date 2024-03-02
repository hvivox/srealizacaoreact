import { Table, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName } from "../redux/reducers/useReducer";
import { useAppSelector } from "../redux/hooks/useAppSelector";
interface Folha {
  id: number;
  foco: string;
  dtarealizacao: Date;
  notadia: number;
  //acoes?: any; // Adicione os tipos apropriados se tiver uma estrutura definida para ações
}

interface Pagination {
  current: number;
  pageSize: number;
  totalItem: number;
}

export const ListaFolhaView = () => {
  const [listaEntidade, setListaEntidade] = useState<Folha[]>([]);
  const [isErroResposta, setIsErroResposta] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);

  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    totalItem: 0,
  });

  useEffect(() => {
    consultaFolhaList(pagination.current - 1, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, pagination.totalItem]);

  const consultaFolhaList = async (page = 0, pageSize = 3) => {
    const url = `http://localhost:8080/folhas?size=${pageSize}&page=${page}&sort=id,asc&status=true`;

    await axios
      .get(url)
      .then((response) => {
        setListaEntidade(response.data.content as Folha[]);

        setPagination((pagination) => ({
          ...pagination,
          totalItem: response.data.totalElements, // Atualiza o total de elementos
          current: page + 1, // Atualize a página atual, se necessário
          pageSize, // Atualize o tamanho da página, se necessário
        }));
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
    navigate(`/editar/${record.id}`);
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
  /* useEffect(() => {
    consultaFolhaList();
  }, []);*/

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      sorter: (a: Folha, b: Folha) => a.id - b.id,
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

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setName(e.target.value));
  };

  return (
    <div>
      <input type="text" value={user.name} onChange={handleNameInput}></input>
      <hr></hr>
      <Table
        dataSource={listaEntidade}
        columns={columns}
        rowKey={"id"}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.totalItem,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
            // consultaFolhaList(page - 1, pageSize); // Atualize isso para buscar dados conforme a página muda
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
        }}
      />
    </div>
  );
};
