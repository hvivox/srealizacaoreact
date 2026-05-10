import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Divider,
  Typography,
  Card,
  Space,
  Tag,
} from "antd";

import moment from "moment";
import { TodoList } from "../components/Todo/TodoList";
import { Sheet, TodoItem, TODO_LIST_SLICE_KEYS } from "../types/Types";
import { useAppSelector } from "../redux/hooks/useAppSelector.tsx";
import { setTodoList } from "../redux/reducers/todoListReducer.tsx";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth.ts";
import { api } from "../services/api.ts";
import { notifySuccess } from "../utils/notification.ts";
import styles from "./SheetRegisterView.module.scss";

const { Title, Text, Paragraph } = Typography;

export const SheetRegisterView = () => {
  const { token } = useAuth();
  const tokenHeader = token;

  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();
  const editRecordId = searchParams.get("edit");
  const navigate = useNavigate();
  const [jsonPreview, setJsonPreview] = useState("");
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const dispatch = useDispatch();
  const todoItemList = useAppSelector((state) => state.todoListReducer);

  const { priorityList, gratitudeList, restrictionList, learningList } = todoItemList;

  useEffect(() => {
    if (editRecordId) {
      const url = `sheets/${editRecordId}`;
      api
        .get(url, {
          headers: {
            Authorization: `Bearer ${tokenHeader}`,
          },
        })
        .then((response) => {
          const dataFound = {
            ...response.data,
            realizationDate: moment(response.data.realizationDate),
            status: response.data.status,
            priorityList: response.data.priorityList,
            gratitudeList: response.data.gratitudeList,
            restrictionList: response.data.restrictionList,
            learningList: response.data.learningList,
          };
          form.setFieldsValue(dataFound);

          dispatch(setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.PRIORITY, todoList: dataFound.priorityList }));
          dispatch(setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.GRATITUDE, todoList: dataFound.gratitudeList }));
          dispatch(
            setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.RESTRICTION, todoList: dataFound.restrictionList })
          );
          dispatch(setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.LEARNING, todoList: dataFound.learningList }));
        })

        .catch((error) => {
          console.error("Erro ao buscar folha", error);
        });
    } else {
      const emptyList = new Array<TodoItem>();

      dispatch(setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.PRIORITY, todoList: emptyList }));
      dispatch(setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.GRATITUDE, todoList: emptyList }));
      dispatch(setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.RESTRICTION, todoList: emptyList }));
      dispatch(setTodoList({ sliceName: TODO_LIST_SLICE_KEYS.LEARNING, todoList: emptyList }));

      form.setFieldsValue({ status: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRecordId, form]);

  const handleSubmit = (values: Sheet) => {
    const rawStatus = values.status as unknown;
    const statusNum =
      rawStatus === true || rawStatus === 1 || rawStatus === "1"
        ? 1
        : rawStatus === false || rawStatus === 0 || rawStatus === "0"
          ? 0
          : Number(rawStatus);
    const sheetToSave = {
      ...values,
      status: Number.isFinite(statusNum) ? statusNum : 1,
      realizationDate: moment(values.realizationDate).toDate(),
      priorityList,
      gratitudeList,
      restrictionList,
      learningList,
    };

    const urlPut = `sheets/${editRecordId}`;
    const urlPost = `sheets`;

    const headers = {
      Authorization: `Bearer ${tokenHeader}`,
    };

    const request = editRecordId
      ? api.put(urlPut, sheetToSave, { headers })
      : api.post(urlPost, sheetToSave, { headers });
    request
      .then(() => {
        notifySuccess();
        navigate("/sheet-list");
      })
      .catch((error) => {
        console.error("Erro inesperado", error);
      })
  };

  const handleValuesChange = (_changedValues: Sheet, allValues: Sheet) => {
    if (showJsonPreview) {
      const sheetToSave = {
        ...allValues,
        realizationDate: moment(allValues.realizationDate).toDate(),
        priorityList,
        gratitudeList,
        restrictionList,
        learningList,
      };
      setJsonPreview(JSON.stringify(sheetToSave, null, 2));
    }
  };

  const toggleJsonPreview = () => {
    if (!showJsonPreview) {
      const values = form.getFieldsValue();
      const sheetToSave = {
        ...values,
        realizationDate: moment(values.realizationDate).toDate(),
        priorityList,
        gratitudeList,
        restrictionList,
        learningList,
      };
      setJsonPreview(JSON.stringify(sheetToSave, null, 2));
    }
    setShowJsonPreview(!showJsonPreview);
  };

  return (
    <div className={styles.page}>
      <Space direction="vertical" size={4} style={{ width: "100%" }}>
        <Space align="center" wrap size={8}>
          <Title level={2} style={{ margin: 0 }}>
            Cadastro de folha
          </Title>
          {editRecordId ? (
            <Tag color="processing">Edição · id {editRecordId}</Tag>
          ) : (
            <Tag color="default">Nova folha</Tag>
          )}
        </Space>
        <Paragraph type="secondary" className={styles.lead} style={{ marginBottom: 0 }}>
          Defina a data, a nota e o foco. Depois preencha as quatro listas: pode arrastar itens para
          reordenar e confirmar antes de apagar.
        </Paragraph>
      </Space>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        requiredMark="optional"
        style={{ marginTop: 8 }}
      >
        <Card title="Dados principais" className={styles.sectionCard} bordered>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={10}>
              <Form.Item
                label="Data de realização"
                name="realizationDate"
                rules={[{ required: true, message: "Escolha a data" }]}
                tooltip="Data a que esta folha se refere"
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Selecione" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={10}>
              <Form.Item
                label="Nota do dia"
                name="dayNote"
                rules={[{ required: true, message: "Indique a nota (1 a 10)" }]}
                initialValue={1}
                tooltip="Avaliação do dia numa escala de 1 a 10"
              >
                <InputNumber min={1} max={10} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                label="Foco"
                name="focus"
                rules={[{ required: true, message: "Descreva o foco do dia" }]}
                tooltip="Tema ou objetivo central desta folha"
              >
                <Input placeholder="Ex.: alinhamento com a equipa, entrega ao cliente…" allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" hidden initialValue={1}>
            <InputNumber min={0} max={1} />
          </Form.Item>
        </Card>

        <Card title="Listas de reflexão" className={styles.sectionCard} bordered>
          <Text type="secondary">
            Quatro blocos independentes. Cada um tem o seu campo de texto e o botão + para adicionar.
          </Text>
          <Divider style={{ margin: "16px 0" }} />
          <Row gutter={[24, 24]} className={styles.listsRow}>
            <Col xs={24} xl={12}>
              <TodoList
                form={form}
                todoTitle="Prioridade"
                fieldName="priority"
                sliceAndListName={TODO_LIST_SLICE_KEYS.PRIORITY}
              />
              <Divider dashed style={{ margin: "8px 0 16px" }} />
              <TodoList
                form={form}
                todoTitle="Restrição"
                fieldName="restriction"
                sliceAndListName={TODO_LIST_SLICE_KEYS.RESTRICTION}
              />
            </Col>
            <Col xs={24} xl={12}>
              <TodoList
                form={form}
                todoTitle="Aprendizagens"
                fieldName="learning"
                sliceAndListName={TODO_LIST_SLICE_KEYS.LEARNING}
              />
              <Divider dashed style={{ margin: "8px 0 16px" }} />
              <TodoList
                form={form}
                todoTitle="Gratidão"
                fieldName="gratitude"
                sliceAndListName={TODO_LIST_SLICE_KEYS.GRATITUDE}
              />
            </Col>
          </Row>
        </Card>

        <div className={styles.footerBar}>
          <Button type="link" onClick={toggleJsonPreview} style={{ paddingLeft: 0 }}>
            {showJsonPreview ? "Ocultar pré-visualização JSON" : "Mostrar pré-visualização JSON"}
          </Button>
          <div className={styles.footerActions}>
            <Button onClick={() => navigate("/sheet-list")}>Voltar à lista</Button>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    form.getFieldsError().filter(({ errors }) => errors.length).length > 0
                  }
                >
                  Salvar folha
                </Button>
              )}
            </Form.Item>
          </div>
        </div>

        {showJsonPreview && jsonPreview ? (
          <Card size="small" title="JSON (técnico)" className={styles.jsonCard}>
            <pre className={styles.jsonPre}>{jsonPreview}</pre>
          </Card>
        ) : null}
      </Form>
    </div>
  );
};
