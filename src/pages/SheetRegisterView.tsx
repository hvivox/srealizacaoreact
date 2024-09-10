// SheetEditPage.tsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker, Form, Input, InputNumber, Button, Row, Col } from "antd";

import moment from "moment";
import { TitleForm } from "../components/LayoutForm/TitleForm";

interface Sheet {
  id: number;
  focus: string;
  realizationDate: Date;
  dayNote: number;
}

export const SheetRegisterView = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [jsonPreview, setJsonPreview] = useState("");

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`http://localhost:8080/sheets/${id}`)
        .then((response) => {
          const data = {
            ...response.data,
            realizationDate: moment(response.data.realizationDate),
            status: response.data.status,
          };
          form.setFieldsValue(data);
        })

        .catch((error) => {
          console.error("Erro ao buscar folha", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Define um valor padrão para o status quando criando uma nova folha
      form.setFieldsValue({ status: true }); // Defina aqui o valor padrão desejado
    }
  }, [id, form]);

  const handleSubmit = (values: Sheet) => {
    const sheetToSave = {
      ...values,
      id: Number(id), // Garantindo que o ID seja um número
      realizationDate: moment(values.realizationDate).toDate(), // Convertendo de Moment para Date
    };

    // Atualizando o estado para exibir na interface
    setJsonPreview(JSON.stringify(sheetToSave, null, 2));

    setIsLoading(true);
    axios
      .put(`http://localhost:8080/sheets/${id}`, sheetToSave)
      .then(() => {
        navigate("/sheet-list");
      })
      .catch((error) => {
        console.error("Erro ao atualizar a folha", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        notadia: 0, // Valor inicial para garantir que o formulário tenha todos os valores padrão necessários
      }}
    >
      <Row gutter={16} style={{ marginTop: "10px" }}>
        <Col span={8}>
          <TitleForm>Cadastro de Folha</TitleForm>
        </Col>
        <Col span={8}>
          <Form.Item label="Data de Realização" name="realizationDate" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        </Col>
        <Col span={8}>
          {" "}
          <Form.Item label="Nota do Dia" name="dayNote" rules={[{ required: true }]}>
            <InputNumber min={0} max={10} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Foco" name="focus" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" hidden={true}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>
        <Button onClick={() => navigate("/sheet-list")} style={{ marginLeft: "8px" }}>
          Voltar
        </Button>
      </Form.Item>

      {/* Exibindo o JSON na interface */}
      <pre>{jsonPreview}</pre>
    </Form>
  );
};
