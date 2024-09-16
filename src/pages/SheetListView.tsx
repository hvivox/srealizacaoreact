import { Table, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setName } from "../redux/reducers/useReducer";
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { Pagination, Sheet } from "../types/Types";

export const SheetListView = () => {
  const [entityList, setEntityList] = useState<Sheet[]>([]);
  const [isResponseError, setIsResponseError] = useState(false);
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
    sheetConsultList(pagination.current - 1, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, pagination.totalItem]);

  const sheetConsultList = async (page = 0, pageSize = 3) => {
    const url = `http://localhost:8080/sheets?size=${pageSize}&page=${page}&sort=id,asc&status=true`;

    await axios
      .get(url)
      .then((response) => {
        setEntityList(response.data.content as Sheet[]);

        setPagination((pagination) => ({
          ...pagination,
          totalItem: response.data.totalElements, // Atualiza o total de elementos
          current: page + 1, // Atualize a página atual, se necessário
          pageSize, // Atualize o tamanho da página, se necessário
        }));
      })
      .catch((error) => {
        setIsResponseError(isResponseError);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(isLoading);
      });
  };

  const inactiveItem = (record: Sheet) => {
    setIsLoading(true);
    const removeId = record.id;
    const url = "http://localhost:8080/sheets/" + removeId;
    const data = {
      STATUS: 0,
    };

    axios
      .patch(url, data)
      .then((response) => {
        // Removendo o registro inativado do estado
        setEntityList((prevList) => prevList.filter((item) => item.id !== record.id));

        // Aqui você pode mostrar uma notificação de sucesso. No entanto, o código original usava a biblioteca de notificação do Vue.
        // Se você estiver usando alguma biblioteca de notificação no React, pode invocar aqui.
        console.log(response.data.message());
      })
      .catch((error) => {
        setIsResponseError(true);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = (record: Sheet) => {
    navigate(`/edit/${record.id}`);
    console.log("Editando:", record);
    // Aqui você pode navegar para a tela de edição ou abrir um modal de edição
  };

  const handleInactivate = (record: Sheet) => {
    // console.log("Inativando:", record);
    showConfirm(record);
    // Aqui você pode fazer a chamada API para inativar o registro ou abrir uma confirmação
  };

  function showConfirm(record: Sheet) {
    Modal.confirm({
      title: `Deseja inativar o item ${record.id}?`,
      content: "Ao inativar este item, ele não estará mais disponível.",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk() {
        inactiveItem(record);
      },
      onCancel() {
        console.log("Ação cancelada");
      },
    });
  }

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      sorter: (a: Sheet, b: Sheet) => a.id - b.id,
    },
    {
      title: "Foco ",
      dataIndex: "focus",
      key: "focus",
    },
    {
      title: "Data Entrega",
      dataIndex: "realizationDate",
      key: "realizationDate",
    },

    {
      title: "Nota",
      dataIndex: "dayNote",
      key: "dayNote",
    },
    {
      title: "Ações",
      key: "action",
      render: (_value: string, record: Sheet) => (
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
        dataSource={entityList}
        columns={columns}
        rowKey={"id"}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.totalItem,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
            // sheetConsultList(page - 1, pageSize); // Atualize isso para buscar dados conforme a página muda
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
        }}
      />
    </div>
  );
};
