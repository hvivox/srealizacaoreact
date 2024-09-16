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
  form: FormInstance;
  todoTitle: string;
  fieldName: string;
}

export const TodoList: React.FC<TodoListProps> = ({ form, todoTitle, fieldName }) => {
  const [todoItem, setTodoItem] = useState("");
  const todoItemList = useAppSelector((state) => state.todoListReducer[fieldName]);
  const dispatch = useDispatch();

  const handleAddItem = () => {
    try {
      form.validateFields([fieldName]);
      const values = form.getFieldsValue();
      const fieldValue = values[fieldName]; // Acessa o campo correto

      if (!fieldValue || !fieldValue.trim()) {
        form.setFields([
          {
            name: fieldName,
            errors: ["Descreva a atividade"],
          },
        ]);
        return;
      }

      const newTodo: TodoItem = {
        id: Date.now(),
        text: fieldValue,
        completed: false,
      };
      dispatch(addTodo({ sliceName: fieldName, todo: newTodo }));
      setTodoItem("");
      form.resetFields([fieldName]);
    } catch (errorInfo) {
      console.log("Erro de validação:", errorInfo);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(); // Adiciona a tarefa ao pressionar Enter
    }
  };

  return (
    <div>
      <h3>{todoTitle}</h3>

      <Row gutter={16}>
        <Col span={16}>
          <Form.Item name={fieldName}>
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
              <Button
                icon={<DeleteOutlined />}
                onClick={() => dispatch(deleteTodo({ sliceName: fieldName, id: todo.id }))}
              />,
            ]}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo({ sliceName: fieldName, id: todo.id }))}
            />

            <Typography.Text delete={todo.completed}>{todo.text}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};
