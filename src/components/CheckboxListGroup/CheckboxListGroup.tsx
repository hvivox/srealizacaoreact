import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Checkbox, List } from "antd";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const App = () => {
  const [checked, setChecked] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    setIndeterminate(checked.length && checked.length !== data.length);
    setCheckAll(checked.length === data.length);
  }, [checked]);

  const onCheckAllChange = (e: ) => {
    setChecked(e.target.checked ? data.map((item) => item.title) : []);
    setCheckAll(e.target.checked);
  };

  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Check all
      </Checkbox>
      <Checkbox.Group
        style={{ width: "100%" }}
        value={checked}
        onChange={(checkedValues) => {
          setChecked(checkedValues);
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Checkbox value={item.title} />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        />
      </Checkbox.Group>
      <div style={{ marginTop: 20 }}>
        <b>Selecting:</b> {checked.join(", ")}
      </div>
    </>
  );
};

export default App;
