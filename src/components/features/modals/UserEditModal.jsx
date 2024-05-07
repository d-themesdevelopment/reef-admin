import { Button, Form, Input, Radio, Select, Switch } from "antd";
import { useState } from "react";
import Loading from "../Loading";
import { toast } from "react-toastify";

const UserEditModal = ({
  users,
  setUsers,
  selectedUser,
  apiUrl,
  apiToken,
  setOpenUserEdit,
  roles,
  setLoading
}) => {
  const onfinish = async (values) => {
    setLoading(true);

    console.log(
      values?.role,
      roles.find((item) => item.type === values?.role),
      "heyhey"
    );

    let data = {};

    data = { ...data, approvedAsEmployee: values.active };

    if (values?.fullName) {
      data = { ...data, username: values?.fullName };
    }

    if (values?.slug) {
      data = { ...data, slug: values?.slug };
    }

    if (values?.email) {
      data = { ...data, email: values?.email };
    }

    if (values?.password) {
      data = { ...data, password: values?.password };
    }

    if (values?.idNumber) {
      data = { ...data, idNumber: values?.idNumber };
    }

    // if (values?.role) {
    //   data = {
    //     ...data,
    //     role: roles.find((item) => item.type === values?.role),
    //   };
    // }

    if (values?.fatherName) {
      data = { ...data, fatherName: values?.fatherName };
    }

    if (values?.grandFatherName) {
      data = { ...data, grandFatherName: values?.grandFatherName };
    }

    if (values?.address) {
      data = { ...data, address: values?.address };
    }

    if (values?.mobileNumber) {
      data = { ...data, mobileNumber: values?.mobileNumber };
    }

    try {
      const req = await fetch(`${apiUrl}/api/users/${selectedUser?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      const res = await req.json();

      const temp = users.reduce((arr, cur) => {
        if (cur.id === res.id) {
          arr.push({
            ...cur,
            ...res,
          });
        } else {
          arr.push(cur);
        }

        return arr;
      }, []);

      setTimeout(() => {
        setLoading(false);
        setOpenUserEdit(false);
        setUsers(temp);
      }, 1500);

      toast.success("👌 Successfully Updated!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setLoading(false);
        setOpenUserEdit(false);
      }, 1500);

      toast.error("👌 Failed User Update", {
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

  return (
    <>


      <h3 className="text-2xl font-semibold mb-6">Edit User</h3>

      <Form
        name="basic"
        layout="vertical"
        initialValues={{
          fullName: selectedUser?.username,
          slug: selectedUser?.slug,
          email: selectedUser?.email,
          password: selectedUser?.password,
          idNumber: selectedUser?.idNumber,
          role: selectedUser?.role?.type,
          fatherName: selectedUser?.fatherName,
          grandFatherName: selectedUser?.grandFatherName,
          address: selectedUser?.address,
          mobileNumber: selectedUser?.mobileNumber,
          active: selectedUser?.approvedAsEmployee,
        }}
        autoComplete="off"
        onFinish={onfinish}
      >
        <div className="grid grid-flex-row grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
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
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item label="Slug" name="slug">
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item label="Employee Role" name="role">
              <Select>
                {roles
                  ?.filter(
                    (item) =>
                      item.type !== "public" && item.type !== "authenticated"
                  )
                  ?.map((role, index) => (
                    <Select.Option value={role?.type} key={index}>
                      {role?.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6">
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
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item label="ID Number" name="idNumber">
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item label="Mobile Number" name="mobileNumber">
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item label="Father Name" name="fatherName">
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item label="Grandfather Name" name="grandFatherName">
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="active"
          label="Active Employee"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserEditModal;
