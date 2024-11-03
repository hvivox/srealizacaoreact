import React, { useState } from "react";
import { Input, Button, List, Typography, Checkbox, Form, Row } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Col from "antd/es/grid/col";
import { TodoItem } from "../../types/Types";
import { FormInstance } from "antd/es/form/Form";
import {
  addTodo,
  deleteTodo,
  editTodo,
  reorderTodos as reorderTodoList,
  toggleTodo,
} from "../../redux/reducers/todoListReducer.tsx";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks/useAppSelector.tsx";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface TodoListProps {
  form: FormInstance;
  todoTitle: string;
  fieldName: string;
  sliceAndListName: string;
}

export const TodoList = ({ form, todoTitle, fieldName, sliceAndListName }: TodoListProps) => {
  const [todoItem, setTodoItem] = useState("");
  const todoItemList = useAppSelector((state) => state.todoListReducer[sliceAndListName]);
  const dispatch = useDispatch();
  const [editingItem, setEditingItem] = useState<{ order: number; description: string } | null>(
    null
  );

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedList = Array.from(todoItemList);
    const [movedItem] = reorderedList.splice(result.source.index, 1);
    reorderedList.splice(result.destination.index, 0, movedItem);

    dispatch(reorderTodoList({ sliceName: sliceAndListName, todoList: reorderedList }));
  };

  const handleEditItem = (order: number, description: string) => {
    setEditingItem({ order, description });
  };

  const handleSaveEdit = (order: number) => {
    if (editingItem) {
      dispatch(
        editTodo({
          sliceName: sliceAndListName,
          order: order,
          description: editingItem.description,
        })
      );
      setEditingItem(null);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, description: e.target.value });
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`droppable-${sliceAndListName}`}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <List
                  bordered={true}
                  dataSource={todoItemList}
                  renderItem={(todo, index) => (
                    <Draggable key={todo.order} draggableId={String(todo.order)} index={index}>
                      {(provided) => (
                        <List.Item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          actions={[
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => handleEditItem(todo.order, todo.description)}
                            />,
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                dispatch(
                                  deleteTodo({
                                    sliceName: sliceAndListName,
                                    order: todo.order,
                                  })
                                )
                              }
                            />,
                          ]}
                        >
                          <Checkbox
                            checked={todo.isCompleted}
                            onChange={() =>
                              dispatch(
                                toggleTodo({
                                  sliceName: sliceAndListName,
                                  order: todo.order,
                                })
                              )
                            }
                          />
                          {editingItem && editingItem.order === todo.order ? (
                            <Input
                              value={editingItem.description}
                              onChange={handleEditChange}
                              onBlur={() => handleSaveEdit(todo.order)}
                              onPressEnter={() => handleSaveEdit(todo.order)}
                            />
                          ) : (
                            <Typography.Text delete={todo.isCompleted}>
                              {todo.description}
                            </Typography.Text>
                          )}
                        </List.Item>
                      )}
                    </Draggable>
                  )}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
