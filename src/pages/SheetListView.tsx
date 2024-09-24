import { Table, Modal, Row, Col, Button, Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination, Sheet } from "../types/Types";
import { TitleForm } from "../components/LayoutForm/TitleForm";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const SheetListView = () => {
  const [entityList, setEntityList] = useState<Sheet[]>([]);

  const [isResponseError, setIsResponseError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [filteredEntityList, setFilteredEntityList] = useState<Sheet[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    totalItem: 0,
  });

  useEffect(() => {
    sheetConsultList(pagination.current - 1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, pagination.totalItem]);

  useEffect(() => {
    filterList(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, entityList]);

  const sheetConsultList = async (page = 0, pageSize = 3) => {
    const url = `http://localhost:8080/sheets?size=${pageSize}&page=${page}&sort=id,desc&status=true`;

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
    navigate(`/sheet/edit/${record.id}`);
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

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filterList = (searchValue: string) => {
    const filteredList = entityList.filter((item) =>
      item.focus.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredEntityList(filteredList);
  };

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
      render: (date: Date) => new Date(date).toLocaleDateString("pt-BR"),
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
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#1890ff" }} // Cor do ícone de edição
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleInactivate(record)}
            style={{ color: "red", marginLeft: "10px" }} // Cor do ícone de inativação
          />
        </span>
      ),
    },
  ];

  return (
    <div>
      <Row>
        <Col span={8}>
          <TitleForm>Lista Folha</TitleForm>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Input.Search
            placeholder="Buscar"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={() => navigate("/sheet/register")}>
            Novo
          </Button>
        </Col>
      </Row>

      <Table
        dataSource={filteredEntityList}
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
