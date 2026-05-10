import React, { useState, memo, useCallback, useRef, useMemo } from "react";
import {
  Input,
  Button,
  List,
  Typography,
  Checkbox,
  Form,
  Card,
  Popconfirm,
  message,
} from "antd";
import type { InputRef } from "antd/es/input";
import { DeleteOutlined, EditOutlined, HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { TodoItem, TodoListSliceName } from "../../types/Types";
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
import styles from "./TodoList.module.scss";

interface TodoListProps {
  form: FormInstance;
  todoTitle: string;
  fieldName: string;
  sliceAndListName: TodoListSliceName;
}

export const TodoList = memo(({ form, todoTitle, fieldName, sliceAndListName }: TodoListProps) => {
  const rawList = useAppSelector((state) => state.todoListReducer[sliceAndListName]);
  const todoItemList = useMemo(() => rawList ?? [], [rawList]);
  const dispatch = useDispatch();
  const inputRef = useRef<InputRef>(null);
  const [editingItem, setEditingItem] = useState<{ order: number; description: string } | null>(
    null
  );

  const handleAddItem = useCallback(() => {
    const fieldValue = (form.getFieldValue(fieldName) as string | undefined)?.trim();

    if (!fieldValue) {
      form.setFields([
        {
          name: fieldName,
          errors: ["Descreva a atividade"],
        },
      ]);
      return;
    }

    form.setFields([{ name: fieldName, errors: [] }]);

    const lastItem = todoItemList.length;
    const order = lastItem ? lastItem + 1 : 1;

    const newTodo: TodoItem = {
      order,
      description: fieldValue,
      isCompleted: false,
    };
    dispatch(addTodo({ sliceName: sliceAndListName, todo: newTodo }));
    form.resetFields([fieldName]);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [form, fieldName, todoItemList, sliceAndListName, dispatch]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const reorderedList = Array.from(todoItemList);
      const [movedItem] = reorderedList.splice(result.source.index, 1);
      reorderedList.splice(result.destination.index, 0, movedItem);

      dispatch(reorderTodoList({ sliceName: sliceAndListName, todoList: reorderedList }));
    },
    [todoItemList, sliceAndListName, dispatch]
  );

  const handleEditItem = useCallback((order: number, description: string) => {
    setEditingItem({ order, description });
  }, []);

  const handleSaveEdit = useCallback(
    (order: number) => {
      if (!editingItem || editingItem.order !== order) return;
      const trimmed = editingItem.description.trim();
      if (!trimmed) {
        message.warning("Descrição não pode ficar vazia.");
        setEditingItem(null);
        return;
      }
      dispatch(
        editTodo({
          sliceName: sliceAndListName,
          order,
          description: trimmed,
        })
      );
      setEditingItem(null);
    },
    [editingItem, sliceAndListName, dispatch]
  );

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, description: e.target.value });
    }
  }, [editingItem]);

  const handleToggleTodo = useCallback(
    (order: number) => {
      dispatch(
        toggleTodo({
          sliceName: sliceAndListName,
          order,
        })
      );
    },
    [sliceAndListName, dispatch]
  );

  const handleDeleteTodo = useCallback(
    (order: number) => {
      dispatch(
        deleteTodo({
          sliceName: sliceAndListName,
          order,
        })
      );
    },
    [sliceAndListName, dispatch]
  );

  const count = todoItemList.length;

  return (
    <Card
      className={styles.todoCard}
      size="small"
      bordered
      title={todoTitle}
      extra={<Typography.Text type="secondary">{count} itens</Typography.Text>}
    >
      <div className={styles.addTaskRow}>
        <Form.Item name={fieldName} className={styles.addTaskField}>
          <Input
            ref={inputRef}
            placeholder="Digite a tarefa"
            allowClear
            style={{ width: "100%" }}
            onPressEnter={() => {
              void handleAddItem();
            }}
          />
        </Form.Item>
        <Button
          type="primary"
          className={styles.addTaskButton}
          onClick={() => void handleAddItem()}
          aria-label="Adicionar tarefa"
        >
          <PlusOutlined />
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`droppable-${sliceAndListName}`}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <List
                bordered
                className={styles.listScroll}
                dataSource={todoItemList}
                locale={{
                  emptyText: (
                    <Typography.Text type="secondary">Nenhum item nesta lista.</Typography.Text>
                  ),
                }}
                renderItem={(todo, index) => (
                  <Draggable key={todo.order} draggableId={String(todo.order)} index={index}>
                    {(providedDrag) => (
                      <List.Item
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        actions={[
                          <Button
                            key="edit"
                            type="text"
                            icon={<EditOutlined />}
                            aria-label="Editar tarefa"
                            onClick={() => handleEditItem(todo.order, todo.description)}
                          />,
                          <Popconfirm
                            key="delete"
                            title="Remover esta tarefa?"
                            okText="Remover"
                            cancelText="Cancelar"
                            onConfirm={() => handleDeleteTodo(todo.order)}
                          >
                            <Button type="text" danger icon={<DeleteOutlined />} aria-label="Remover tarefa" />
                          </Popconfirm>,
                        ]}
                      >
                        <div className={styles.row}>
                          <span
                            {...providedDrag.dragHandleProps}
                            className={styles.dragHandle}
                            aria-label="Arrastar para reordenar"
                            role="button"
                            tabIndex={0}
                          >
                            <HolderOutlined />
                          </span>
                          <Checkbox
                            checked={todo.isCompleted}
                            onChange={() => handleToggleTodo(todo.order)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          {editingItem && editingItem.order === todo.order ? (
                            <Input
                              style={{ flex: 1, minWidth: 0 }}
                              value={editingItem.description}
                              onChange={handleEditChange}
                              onBlur={() => handleSaveEdit(todo.order)}
                              onPressEnter={() => handleSaveEdit(todo.order)}
                            />
                          ) : (
                            <Typography.Text delete={todo.isCompleted} style={{ flex: 1, minWidth: 0 }}>
                              {todo.description}
                            </Typography.Text>
                          )}
                        </div>
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
    </Card>
  );
});
