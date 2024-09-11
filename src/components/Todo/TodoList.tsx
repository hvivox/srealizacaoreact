import React, { useState } from "react";
import { Input, Button, List, Typography, Checkbox, Form, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Col from "antd/es/grid/col";
import { TodoItem } from "../../types/Types";
import { FormInstance } from "antd/es/form/Form";

interface TodoListProps {
  form: FormInstance; // Adjust the type as needed
}

export const TodoList: React.FC<TodoListProps> = ({ form }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [todoItem, setTodoItem] = useState("");
  //const [form] = Form.useForm();

  const addTodo = (text: string) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleAddItem = async () => {
    try {
      // Valida o campo "task"
      await form.validateFields(["task"]);

      // Se a validação passar, adiciona a tarefa
      const values = form.getFieldsValue();
      if (values.task.trim()) {
        addTodo(values.task);
        setTodoItem(""); // Limpa o campo de input
        form.resetFields(["task"]); // Reseta o campo após adicionar
      }
    } catch (errorInfo) {
      // Se houver erro de validação, ele será exibido automaticamente pelo Ant Design
      console.log("Erro de validação:", errorInfo);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previne o comportamento padrão de envio de formulário
      handleAddItem(); // Adiciona a tarefa ao pressionar Enter
    }
  };

  return (
    <div>
      <Form form={form} onSubmitCapture={(e) => e.preventDefault()}>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item name="task" rules={[{ required: true, message: "Descreva a atividade" }]}>
              <Input
                placeholder="Add a new task"
                value={todoItem}
                onChange={(e) => setTodoItem(e.target.value)}
                onKeyUp={handleKeyUp}
              />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" onClick={() => handleAddItem()}>
              + Add Task
            </Button>
          </Col>
        </Row>
      </Form>

      <List
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[<Button icon={<DeleteOutlined />} onClick={() => handleDelete(todo.id)} />]}
          >
            <Checkbox checked={todo.completed} onChange={() => handleToggle(todo.id)} />

            <Typography.Text delete={todo.completed}>{todo.text}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};
