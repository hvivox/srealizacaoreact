import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker, Form, Input, InputNumber, Button, Row, Col, Divider } from "antd";

import moment from "moment";
import { TitleForm } from "../components/LayoutForm/TitleForm";
import { TodoList } from "../components/Todo/TodoList";
import { Sheet, TodoItem } from "../types/Types";
import { useAppSelector } from "../redux/hooks/useAppSelector.tsx";
import { setTodoList } from "../redux/reducers/todoListReducer.tsx";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth.ts";
import { api } from "../services/api.ts";

export const SheetRegisterView = () => {
  const { token } = useAuth();
  const tokenHeader = token;

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jsonPreview, setJsonPreview] = useState("");
  const dispatch = useDispatch();
  const todoItemList = useAppSelector((state) => state.todoListReducer);

  const { priorityList, gratitudeList, restrictionList, learningList } = todoItemList;

  useEffect(() => {
    if (id) {
      const url = `sheets/${id}`;
      setIsLoading(true);
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

          // Despachar ações para preencher as listas
          dispatch(setTodoList({ sliceName: "priorityList", todoList: dataFound.priorityList }));
          dispatch(setTodoList({ sliceName: "gratitudeList", todoList: dataFound.gratitudeList }));
          dispatch(
            setTodoList({ sliceName: "restrictionList", todoList: dataFound.restrictionList })
          );
          dispatch(setTodoList({ sliceName: "learningList", todoList: dataFound.learningList }));
        })

        .catch((error) => {
          console.error("Erro ao buscar folha", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // criar uma variavel com todoList vazio
      const emptyList = new Array<TodoItem>();

      dispatch(setTodoList({ sliceName: "priorityList", todoList: emptyList }));
      dispatch(setTodoList({ sliceName: "gratitudeList", todoList: emptyList }));
      dispatch(setTodoList({ sliceName: "restrictionList", todoList: emptyList }));
      dispatch(setTodoList({ sliceName: "learningList", todoList: emptyList }));

      form.setFieldsValue({ status: true }); // Defina aqui o valor padrão do status ao criar registro
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, form]);

  const handleSubmit = (values: Sheet) => {
    const sheetToSave = {
      ...values,
      realizationDate: moment(values.realizationDate).toDate(),
      priorityList,
      gratitudeList,
      restrictionList,
      learningList,
    };

    setIsLoading(true);
    const urlPut = `sheets/${id}`;
    const urlPost = `sheets`;

    const headers = {
      Authorization: `Bearer ${tokenHeader}`,
    };

    const request = id
      ? api.put(urlPut, sheetToSave, { headers })
      : api.post(urlPost, sheetToSave, { headers });
    request
      .then(() => {
        navigate("/sheet-list");
      })
      .catch((error) => {
        console.error("Erro ao salvar a folha", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) return <h1>Carregando...</h1>;

  // Atualiza o JSON sempre que os campos do formulário forem alterados
  const handleValuesChange = (_changedValues: Sheet, allValues: Sheet) => {
    const sheetToSave = {
      ...allValues,
      realizationDate: moment(allValues.realizationDate).toDate(),
      priorityList,
      gratitudeList,
      restrictionList,
      learningList,
    };
    setJsonPreview(JSON.stringify(sheetToSave, null, 2));
    //console.log(JSON.stringify(changedValues, null, 2));
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} onValuesChange={handleValuesChange}>
      <Row gutter={16} style={{ marginTop: "10px" }}>
        <Col span={8}>
          <TitleForm>Cadastro de Folha</TitleForm>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Data de Realização"
            name="realizationDate"
            rules={[{ required: true, message: "Preenha o campo data" }]}
          >
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={8}>
          {" "}
          <Form.Item
            label="Nota do Dia"
            name="dayNote"
            rules={[{ required: true, message: "Preencha o campo nota do dia" }]}
            initialValue={0}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Foco"
            name="focus"
            rules={[{ required: true, message: "Preenha o campo foco" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" hidden={true}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={11}>
          <TodoList
            form={form}
            todoTitle="Prioridade"
            fieldName="priority"
            sliceAndListName="priorityList"
          />
          <Divider orientation="left"></Divider>
          <TodoList
            form={form}
            todoTitle="Restrição"
            fieldName="restriction"
            sliceAndListName="restrictionList"
          />
        </Col>

        <Col>
          <Divider type="vertical" style={{ height: "100%", minHeight: "400px" }} />
        </Col>
        <Col span={11}>
          <TodoList
            form={form}
            todoTitle="Aprendizagens"
            fieldName="learning"
            sliceAndListName="learningList"
          />
          <Divider orientation="left"></Divider>
          <TodoList
            form={form}
            todoTitle="Gratidão"
            fieldName="gratitude"
            sliceAndListName="gratitudeList"
          />
        </Col>
      </Row>

      {/* Botões para salvar e voltar */}
      <Form.Item shouldUpdate>
        {() => (
          <Row gutter={1} style={{ marginTop: "4%", justifyContent: "flex-end" }}>
            <Col span={6}>
              <Button onClick={() => navigate("/sheet-list")} style={{ marginLeft: "8px" }}>
                Voltar
              </Button>
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                onClick={() => form.submit()}
                disabled={form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
              >
                Salvar
              </Button>
            </Col>            
          </Row>
        )}
      </Form.Item>
      {/* Exibindo o JSON na interface */}
      <pre>{jsonPreview}</pre>
    </Form>
  );
};
