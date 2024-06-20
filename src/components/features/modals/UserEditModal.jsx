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
  setLoading,
}) => {
  const onfinish = async (values) => {
    setLoading(true);

    let data = {};

    if (values?.fullName) {
      data = { ...data, username: values?.fullName };
    }

    if (values?.email) {
      data = { ...data, email: values?.email };
    }

    if (values?.idNumber) {
      data = { ...data, idNumber: values?.idNumber };
    }

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

    if (values?.extNumber) {
      data = { ...data, extNumber: values?.extNumber };
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
          email: selectedUser?.email,
          idNumber: selectedUser?.idNumber,
          fatherName: selectedUser?.fatherName,
          grandFatherName: selectedUser?.grandFatherName,
          address: selectedUser?.address,
          mobileNumber: selectedUser?.mobileNumber,
          extNumber: selectedUser?.extNumber
          //   active: selectedUser?.approvedAsEmployee,
        }}
        autoComplete="off"
        onFinish={onfinish}
      >
        <div className="grid grid-flex-row grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <Form.Item
              label="First Name"
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
            <Form.Item label="Ext Number" name="extNumber">
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
        {/* 
        <Form.Item
          name="active"
          label="Active Employee"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item> */}

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
