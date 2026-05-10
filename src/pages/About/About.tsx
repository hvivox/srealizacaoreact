import { Link } from "react-router";
import type { ReactNode } from "react";
import { Typography, Collapse, Card, Space } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

type FaqItem = {
  key: string;
  question: string;
  answer: ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    key: "1",
    question: "O que é esta aplicação?",
    answer: (
      <>
        É uma aplicação web para <Text strong>registar e acompanhar folhas de realização</Text>: registo
        da data, de uma nota para o dia, do foco principal e de quatro listas de reflexão (prioridades,
        restrições, aprendizagens e gratidão). O painel inicial resume as folhas já registadas com
        indicadores e gráficos.
      </>
    ),
  },
  {
    key: "2",
    question: "Para que serve o cadastro de folha?",
    answer: (
      <>
        Permite <Text strong>criar ou alterar uma folha</Text>, associando a data de realização, a nota
        do dia (escala 1–10), o foco descritivo e os itens das listas. Ao guardar, os dados são
        enviados ao servidor; em modo edição, a folha existente é atualizada.
      </>
    ),
  },
  {
    key: "3",
    question: "O que são as quatro listas no cadastro?",
    answer: (
      <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
        <li>
          <Text strong>Prioridade</Text> — o que destacou como mais importante.
        </li>
        <li>
          <Text strong>Restrição</Text> — limitações ou obstáculos relevantes.
        </li>
        <li>
          <Text strong>Aprendizagens</Text> — conclusões ou aprendizados do período.
        </li>
        <li>
          <Text strong>Gratidão</Text> — aspectos pelos quais se sente grato.
        </li>
      </ul>
    ),
  },
  {
    key: "4",
    question: "Como adiciono, ordeno ou removo itens nas listas?",
    answer: (
      <>
        Escreve o texto no campo da lista e usa o botão <Text strong>+</Text> (ou Enter) para
        adicionar. Podes <Text strong>marcar como concluído</Text>, <Text strong>editar</Text> o texto,
        <Text strong>arrastar pelo ícone de alça</Text> para reordenar e <Text strong>eliminar</Text>{" "}
        com confirmação.
      </>
    ),
  },
  {
    key: "5",
    question: "O que mostra o painel inicial (home)?",
    answer: (
      <>
        Consolida <Text strong>estatísticas</Text> das folhas (totais, ativas/inativas, nota média),
        destaca a última folha registada e apresenta <Text strong>gráficos</Text> (por exemplo
        distribuição por estado e evolução da nota). A partir daí podes ir para a lista ou para novo
        cadastro.
      </>
    ),
  },
  {
    key: "6",
    question: "Como funciona a lista de folhas?",
    answer: (
      <>
        A <Text strong>lista paginada</Text> permite pesquisar, ver folhas ativas ou incluir inativas,
        editar e inativar registos. A edição abre o cadastro com os dados já carregados.
      </>
    ),
  },
  {
    key: "7",
    question: "Como me autentico e o que acontece com a sessão?",
    answer: (
      <>
        O acesso é feito com <Text strong>login institucional (Keycloak)</Text>. A sessão renova o
        token quando necessário; se a sessão expirar, serás pedido a voltar a autenticar-te. Não
        partilhes credenciais nem uses esta aplicação em dispositivos não confiáveis.
      </>
    ),
  },
  {
    key: "8",
    question: "Que tecnologias sustentam o sistema (visão geral)?",
    answer: (
      <>
        O front-end é uma <Text strong>SPA em React</Text> com TypeScript, Vite, interface Ant Design,
        estado com Redux Toolkit, chamadas HTTP com Axios e gráficos na home. Isto é apenas um
        resumo informativo para equipas técnicas ou curiosidade; o detalhe de versões está no código
        do projeto.
      </>
    ),
  },
];

export const About = () => {
  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 0 32px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            Sobre o sistema
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 15 }}>
            Informação geral sobre a aplicação de folhas de realização e respostas às dúvidas mais
            comuns. Cada secção abre ao clicar (sanfona).
          </Paragraph>
        </div>

        <Card>
          <Collapse
            accordion
            bordered={false}
            expandIconPosition="right"
            defaultActiveKey={["1"]}
          >
            {FAQ_ITEMS.map((item) => (
              <Panel
                key={item.key}
                header={
                  <Space>
                    <QuestionCircleOutlined style={{ color: "#1890ff" }} />
                    <Text strong>{item.question}</Text>
                  </Space>
                }
              >
                <Paragraph style={{ marginBottom: 0 }}>{item.answer}</Paragraph>
              </Panel>
            ))}
          </Collapse>
        </Card>

        <Paragraph style={{ marginBottom: 0 }}>
          <Link to="/">← Voltar ao painel</Link>
        </Paragraph>
      </Space>
    </div>
  );
};
