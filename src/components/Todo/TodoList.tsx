import React, { useState } from "react";
import { Input, Button, List, Typography, Checkbox, Form, Row } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
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
  sliceAndListName: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  form,
  todoTitle,
  fieldName,
  sliceAndListName,
}) => {
  const [todoItem, setTodoItem] = useState("");
  const todoItemList = useAppSelector((state) => state.todoListReducer[sliceAndListName]);
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

      // Calcular a ordem com base no comprimento atual da lista
      const lastItem = todoItemList?.length;
      const order = lastItem ? lastItem + 1 : 1;

      const newTodo: TodoItem = {
        order: order,
        description: fieldValue,
        isCompleted: false,
      };
      dispatch(addTodo({ sliceName: sliceAndListName, todo: newTodo }));
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
              placeholder="Digite a tarefa"
              value={todoItem}
              onChange={(e) => setTodoItem(e.target.value)}
              onKeyUp={handleKeyUp}
            />
          </Form.Item>
        </Col>
        <Col>
          <Button type="primary" onClick={() => handleAddItem()}>
            <PlusOutlined />
          </Button>
        </Col>
      </Row>

      <div style={{ maxHeight: "260px", overflowY: "auto" }}>
        <List
          bordered={true}
          dataSource={todoItemList}
          renderItem={(todo) => (
            <List.Item
              key={todo.order}
              actions={[
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    dispatch(deleteTodo({ sliceName: sliceAndListName, order: todo.order }))
                  }
                />,
              ]}
            >
              <Checkbox
                checked={todo.isCompleted}
                onChange={() =>
                  dispatch(toggleTodo({ sliceName: sliceAndListName, order: todo.order }))
                }
              />

              <Typography.Text delete={todo.isCompleted}>{todo.description}</Typography.Text>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};
