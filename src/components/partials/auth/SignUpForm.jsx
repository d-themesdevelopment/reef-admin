import { Button, Input, Radio, Switch } from "antd";
import Form from "antd/es/form/Form";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/common/Loading";

const SignUpForm = ({ apiUrl, apiToken }) => {
  const [loading, setLoading] = useState(false);

  const onfinish = async (values) => {
    setLoading(true);

    const username = values.fullName;
    const email = values.email;
    const password = values.password;
    const isEmployee = true;

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
        isEmployee
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
                required: true,
                message: "Please input more than 6 characters",
                min: 6,
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
