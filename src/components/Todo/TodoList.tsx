import React, { useState } from "react";
import { Input, Button, List, Typography, Checkbox, Form, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Col from "antd/es/grid/col";
import { TodoItem } from "../../types/Types";
import { FormInstance } from "antd/es/form/Form";
import { addTodo, deleteTodo, toggleTodo } from "../../redux/reducers/todoListReducer.tsx";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks/useAppSelector.tsx";

interface TodoListProps {
  form: FormInstance; // Adjust the type as needed
  todoTitle: string; // The title of the todo list
}

export const TodoList: React.FC<TodoListProps> = ({ form, todoTitle }) => {
  const [todoItem, setTodoItem] = useState("");
  const todoItemList = useAppSelector((state) => state.todoListReducer);
  const dispatch = useDispatch();
  //const [form] = Form.useForm();
  //const [todos, setTodos] = useState<TodoItem[]>([]);

  const handleAddItem = async () => {
    try {
      await form.validateFields(["task"]);
      const values = form.getFieldsValue();
      if (values.task.trim()) {
        const newTodo: TodoItem = {
          id: Date.now(),
          text: values.task,
          completed: false,
        };
        dispatch(addTodo(newTodo));
        setTodoItem("");
        form.resetFields(["task"]);
      }
    } catch (errorInfo) {
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
      <h3>{todoTitle}</h3>

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

      <List
        bordered
        dataSource={todoItemList}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button icon={<DeleteOutlined />} onClick={() => dispatch(deleteTodo(todo.id))} />,
            ]}
          >
            <Checkbox checked={todo.completed} onChange={() => dispatch(toggleTodo(todo.id))} />

            <Typography.Text delete={todo.completed}>{todo.text}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};
