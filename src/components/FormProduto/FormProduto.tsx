import { useState } from "react";
import { Modal, Button, Input, Form, Checkbox } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

export const FormProduto = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [nomeModal, setNomeModal] = useState("");
  const [culturasSelecionadas, setCulturasSelecionadas] = useState<CheckboxValueType[]>([]);
  const handleCulturasChange = (selectedCulturas: CheckboxValueType[]) => {
    setCulturasSelecionadas(selectedCulturas);
  };
  const culturas = ["Soja", "Milho", "Trigo", "Arroz", "Feijão"];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleEnviarParaModal = () => {
    setNomeModal(nome);
    showModal();
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>Exemplo com Ant Design</h1>
      <Input placeholder="Nome" value={nome} onChange={handleNomeChange} />
      <Button type="primary" onClick={handleEnviarParaModal}>
        Enviar para Modal
      </Button>
      <Modal
        title="Modal com Nome e Lista de Culturas"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form>
          <Form.Item
            label={<strong>Ingrediente Ativo (Grupo Químico) (Concentração)</strong>}
            name="activeIngredient"
          >
            <Input value={nomeModal} onChange={(e) => setNomeModal(e.target.value)} />
          </Form.Item>
          <Form.Item label={<strong>Selecione as Culturas</strong>}>
            <Checkbox.Group onChange={handleCulturasChange} value={culturasSelecionadas}>
              {culturas.map((cultura) => (
                <Checkbox key={cultura} value={cultura}>
                  {cultura}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
