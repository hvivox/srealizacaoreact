import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Tag,
  Button,
  Skeleton,
  Typography,
  Empty,
} from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  StopOutlined,
  StarOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAppSelector } from "../redux/hooks/useAppSelector";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { Sheet } from "../types/Types";

const { Title, Text } = Typography;

export const HomeView = () => {
  const { token } = useAuth();
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const params = new URLSearchParams();
        params.set("size", "1000");
        params.set("page", "0");
        params.set("sort", "id,desc");
        // status vazio => API retorna ativos + inativos
        params.set("status", "");

        const response = await api.get(`sheets?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSheets((response.data?.content ?? []) as Sheet[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, [token]);

  const total = sheets.length;
  const ativos = sheets.filter((s) => Boolean(s.status)).length;
  const inativos = total - ativos;
  const notaMedia =
    total > 0
      ? sheets.reduce((sum, s) => sum + (Number(s.dayNote) || 0), 0) / total
      : 0;

  // Lista já vem com sort=id,desc => primeira é a última cadastrada
  const ultimaFolha = sheets[0];

  const top5 = [...sheets]
    .sort((a, b) => (Number(b.dayNote) || 0) - (Number(a.dayNote) || 0))
    .slice(0, 5);

  const statusData = [
    { name: "Ativas", value: ativos, fill: "#52c41a" },
    { name: "Inativas", value: inativos, fill: "#ff4d4f" },
  ];

  // Evolução: últimas 10 folhas por realizationDate ascendente
  const evolucao = [...sheets]
    .filter((s) => !!s.realizationDate)
    .sort(
      (a, b) =>
        new Date(a.realizationDate).getTime() -
        new Date(b.realizationDate).getTime()
    )
    .slice(-10)
    .map((s) => ({
      data: new Date(s.realizationDate).toLocaleDateString("pt-BR"),
      nota: Number(s.dayNote) || 0,
      id: s.id,
    }));

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Olá, {user.name}!
          </Title>
          <Text type="secondary">
            Visão geral das suas folhas de realização.
          </Text>
        </Col>
        <Col>
          <Link to="/sheet" style={{ marginRight: 8 }}>
            <Button type="primary" icon={<PlusOutlined />}>
              Nova Folha
            </Button>
          </Link>
          <Link to="/sheet-list">
            <Button icon={<UnorderedListOutlined />}>Ver Lista</Button>
          </Link>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active loading={loading} paragraph={{ rows: 1 }}>
              <Statistic
                title="Total de Folhas"
                value={total}
                prefix={<FileTextOutlined />}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active loading={loading} paragraph={{ rows: 1 }}>
              <Statistic
                title="Ativas"
                value={ativos}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active loading={loading} paragraph={{ rows: 1 }}>
              <Statistic
                title="Inativas"
                value={inativos}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<StopOutlined />}
              />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active loading={loading} paragraph={{ rows: 1 }}>
              <Statistic
                title="Nota Média"
                value={notaMedia}
                precision={1}
                prefix={<StarOutlined />}
              />
            </Skeleton>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={10}>
          <Card title="Status das Folhas">
            <Skeleton active loading={loading}>
              <div style={{ width: "100%", height: 280 }}>
                {total === 0 ? (
                  <Empty description="Sem dados" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} md={14}>
          <Card title="Evolução da Nota (últimas 10 folhas)">
            <Skeleton active loading={loading}>
              <div style={{ width: "100%", height: 280 }}>
                {evolucao.length === 0 ? (
                  <Empty description="Sem dados" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolucao}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="nota"
                        stroke="#1677ff"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Skeleton>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Última Folha Cadastrada">
            <Skeleton active loading={loading}>
              {ultimaFolha ? (
                <>
                  <Title level={4} style={{ marginTop: 0 }}>
                    #{ultimaFolha.id} — {ultimaFolha.focus}
                  </Title>
                  <p>
                    <Text type="secondary">Data de Entrega: </Text>
                    {ultimaFolha.realizationDate
                      ? new Date(ultimaFolha.realizationDate).toLocaleDateString("pt-BR")
                      : "-"}
                  </p>
                  <p>
                    <Text type="secondary">Nota: </Text>
                    <Text strong>{ultimaFolha.dayNote}</Text>
                  </p>
                  <p>
                    <Text type="secondary">Status: </Text>
                    {ultimaFolha.status ? (
                      <Tag color="green">Ativo</Tag>
                    ) : (
                      <Tag color="red">Inativo</Tag>
                    )}
                  </p>
                </>
              ) : (
                <Empty description="Sem dados" />
              )}
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top 5 maiores notas">
            <Skeleton active loading={loading}>
              <List
                dataSource={top5}
                locale={{ emptyText: <Empty description="Sem dados" /> }}
                renderItem={(item) => {
                  const tagColor =
                    item.dayNote >= 8 ? "green" : item.dayNote >= 5 ? "blue" : "orange";
                  const dateStr = item.realizationDate
                    ? new Date(item.realizationDate).toLocaleDateString("pt-BR")
                    : "";
                  return (
                    <List.Item extra={<Tag color={tagColor}>Nota {item.dayNote}</Tag>}>
                      <List.Item.Meta title={`#${item.id} — ${item.focus}`} description={dateStr} />
                    </List.Item>
                  );
                }}
              />
            </Skeleton>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
