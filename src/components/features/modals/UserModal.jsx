import { Form, Input } from "antd";

const UserModal = () => {
  const onfinish = (values) => {
    console.log(values);
  };

  return (
    <>
      <Form name="userForm" autoComplete="off" onFinish={onfinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </>
  );
};

export default UserModal;
