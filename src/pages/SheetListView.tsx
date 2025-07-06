import { Table, Modal, Row, Col, Button, Input, Checkbox, CheckboxProps } from "antd";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Pagination, Sheet } from "../types/Types";
import { TitleForm } from "../components/LayoutForm/TitleForm";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { notifyError, notifySuccess } from "../utils/notification";

export const SheetListView = () => {
  const [entityList, setEntityList] = useState<Sheet[]>([]);
  const { token } = useAuth();
  const tokenHeader = token;
  const [showInactiveRecordList, setShowInactiveRecordList] = useState(false);

  const navigate = useNavigate();
  const [filteredEntityList, setFilteredEntityList] = useState<Sheet[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    totalItem: 0,
  });

  useEffect(() => {
    sheetConsultList(pagination.current - 1, pagination.pageSize, showInactiveRecordList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, pagination.totalItem, showInactiveRecordList]);

  useEffect(() => {
    filterList(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, entityList]);

  const sheetConsultList = async (page = 0, pageSize = 3, showInactiveRecordList = false) => {
    const statusFilter = showInactiveRecordList ? "" : true;
    const url = `sheets?size=${pageSize}&page=${page}&sort=id,desc&status=${statusFilter}`;

    await api
      .get(url, {
        headers: {
          Authorization: `Bearer ${tokenHeader}`,
        },
      })
      .then((response) => {
        setEntityList(response.data.content as Sheet[]);

        setPagination((pagination) => ({
          ...pagination,
          totalItem: response.data.totalElements,
          current: page + 1,
          pageSize,
        }));
      })
      .catch((error) => {
        notifyError();
        console.error(error);
      });

  };

  const inactiveItem = (record: Sheet) => {

    const removeId = record.id;
    const data = {
      STATUS: 0,
    };

    api
      .patch(`sheets/${removeId}`, data, {
        headers: {
          Authorization: `Bearer ${tokenHeader}`,
        },
      })
      .then(() => {
        setEntityList((prevList) => prevList.filter((item) => item.id !== record.id));
        notifySuccess();
      })
      .catch((error) => {
        notifyError();
        console.error(error);
      });
  };

  const handleEdit = (record: Sheet) => {
    navigate(`/sheet?edit=${record.id}`);
  };

  const handleInactivate = (record: Sheet) => {
    showConfirm(record);
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
        return;
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
            style={{ color: "#1890ff" }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleInactivate(record)}
            style={{ color: "red", marginLeft: "10px" }}
          />
        </span>
      ),
    },
  ];

  const onChange: CheckboxProps["onChange"] = (e) => {
    setShowInactiveRecordList(e.target.checked);
  };

  function handleSheetViewOpen() {
    navigate("/sheet");
  }

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
        <Col span={1}>
          <Checkbox onChange={onChange}>Mostrar Inativos</Checkbox>
        </Col>
        <Col>
          <Button type="primary" onClick={handleSheetViewOpen}>
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
          },
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", "50"],
        }}
      />
    </div>
  );
};
