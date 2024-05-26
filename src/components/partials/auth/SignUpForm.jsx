import { Button, Input, Form, Select } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/common/Loading";

const SignUpForm = ({ apiUrl, apiToken, employeeRoles }) => {
  const [loading, setLoading] = useState(false);

  const onfinish = async (values) => {
    setLoading(true);

    const username = values.fullName;
    const email = values.email;
    const password = values.password;
    const isEmployee = true;
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
        isEmployee,
        employee_roles
      }),
    };

    const registerationEndpoint = `${apiUrl}/api/auth/local/register`;

    const req = await fetch(registerationEndpoint, reqOptions);
    const res = await req.json();

    if (res.error) {
      console.log(res.error.message, true);
      console.error("❗️Error with the Response" + res.error);

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

      return;
    }

    if (res.jwt && res.user) {
      console.log("Successfull registration");

      setTimeout(() => {
        setLoading(false);
      }, 1500);

      toast.success("👌 Successfull registration!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setTimeout(() => {
        location.href = "/signin";
      }, 1500);
    }
  };

  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <>
      {loading && <Loading />}

      <div className="max-w-[500px] w-full mx-auto min-h-screen flex items-center justify-center">
        <Form
          className="border p-10 rounded-xl shadow-2xl w-full"
          name="basic"
          layout="vertical"
          autoComplete="off"
          onFinish={onfinish}
        >
          <h3 className="text-3xl font-bold mb-6">Register a new user</h3>

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
                type: "email",
                message: "The input is not valid E-mail!",
              },
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
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[-ـ!@#$%^&*()])[A-Za-z\d-ـ!@#$%^&*()]{12,}$/,
                message:
                  "Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
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

          <div className="mb-5">
            Already have an account?{" "}
            <a href="/signin" className="font-semibold text-primary">
              Login
            </a>
          </div>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit">
              Create account
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SignUpForm;
