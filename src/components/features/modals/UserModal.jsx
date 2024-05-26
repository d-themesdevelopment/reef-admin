import { Button, Form, Input, Radio, Select, Switch } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Loading";

const UserModal = ({
  apiUrl,
  apiToken,
  setOpenAddUserModal,
  employeeRoles,
  setLoading,
}) => {
  const onfinish = async (values) => {
    setLoading(true);
    const registerationEndpoint = `${apiUrl}/api/auth/local/register`;
    const username = values.fullName;
    const email = values.email;
    const password = values.password;
    const employee_roles = employeeRoles?.filter((employeeRole) =>
      values?.employeeRoles?.find(
        (item) => item === employeeRole?.attributes?.value
      )
    );

    const reqOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${apiToken}`,
      },
      body: JSON.stringify({
        username,
        email,
        password,
        employee_roles
      }),
    };

    const req = await fetch(registerationEndpoint, reqOptions);
    const res = await req.json();

    if (res.error) {
      console.log(res.error, "res.error");
      setTimeout(() => {
        setLoading(false);
      }, 1500);

      toast.warn("Email or Username already exit!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    if (res.jwt && res.user) {
      console.log("Successfully Added");

      setTimeout(() => {
        setLoading(false);
        setOpenAddUserModal(false);
      }, 1500);

      toast.success("👌 Successfully Added!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">إضافة موظف</h3>
      <Form
        name="basic"
        layout="vertical"
        initialValues={{
          password: "1234567",
          active: true,
        }}
        autoComplete="off"
        onFinish={onfinish}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          extra="Password must be at least 6 characters(default password: 1234567)"
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="employeeRoles"
          label="Employee Roles"
          extra="Employee can have multi roles"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Inserted are removed"
            value={selectedItems}
            onChange={setSelectedItems}
            style={{
              width: "100%",
            }}
            options={employeeRoles?.map((item) => ({
              value: item?.attributes?.value,
              label: item?.attributes?.title,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserModal;
