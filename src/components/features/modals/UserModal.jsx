import { Button, Form, Input, Radio, Select, Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Loading";

const UserModal = ({
  isCustomer,
  apiUrl,
  apiToken,
  setOpenAddUserModal,
  employeeRoles,
  setLoading,
  getUsers
}) => {
  const [form] = Form.useForm();
  const formRef = useRef(null);

  const onReset = () => {
    formRef.current.resetFields();
  };

  const onfinish = async (values) => {
    setLoading(true);
    const registerationEndpoint = `${apiUrl}/api/auth/local/register`;
    const username = values.fullName;
    const email = values.email;
    const password = generatePassword();
    const employee_roles = employeeRoles?.filter((employeeRole) =>
      values?.employeeRoles?.find((item) => item === "admin" ) ? values?.employeeRoles?.find((item) => item === "admin" ) === employeeRole?.attributes?.value : values?.employeeRoles?.find(
        (item) => item === employeeRole?.attributes?.value
      )
    );

    let data = {username, email, password};

    if(!isCustomer) {
      data = {...data, employee_roles, isEmployee: true}
    }

    const reqOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${apiToken}`,
      },
      body: JSON.stringify({
        ...data
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
        onReset();
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

      getUsers();
      const identifier = email;
      
      try {
        await fetch(`${apiUrl}/api/auth/new-user`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${apiToken}`,
          },
          body: JSON.stringify({
            identifier,
            password
          }),
        });     
      } catch (error) {
        console.error(error);
      }
    }
  };

  const generatePassword = () => {
    // Define the character set
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    // Generate the random password
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  };

  const [roles, setRoles] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const getRoles = () => {
    const temp = employeeRoles.reduce((arr, cur) => {
      arr.push({
        label: cur?.attributes?.title,
        value: cur?.attributes?.value,
        disabled: false
      })

      return arr;
    }, [])

    setRoles(temp);
  }

  useEffect(() => {
    getRoles();
  }, [employeeRoles])

  useEffect(() => {
    if(selectedItems.length > 0) {
      if(selectedItems.find((item) => item === "admin")) {
        const temp = roles.reduce((arr, cur) => {
          if(cur.value !== "admin") {
            arr.push({
              ...cur,
              disabled: true,
            })
          } else {
            arr.push(cur);
          }

          return arr;
        }, []);

        setRoles(temp);
      } else {
        const temp = roles.reduce((arr, cur) => {
          if(cur.value === "admin") {
            arr.push({
              ...cur,
              disabled: true,
            })
          } else {
            arr.push(cur);
          }

          return arr;
        }, []);

        setRoles(temp);
      }
    } else {
      getRoles();
    }
  }, [selectedItems])

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">إضافة موظف</h3>
      <Form
        ref={formRef}
        name="basic"
        layout="vertical"
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

        {
          !isCustomer &&  <Form.Item
          name="employeeRoles"
          label="Employee Roles"
          extra="Employee can have multi roles"
        >
          <Select
            mode="multiple"
            placeholder="Inserted are removed"
            value={selectedItems}
            onChange={setSelectedItems}
            style={{
              width: "100%",
            }}
            options={roles?.map((item) => ({
              value: item?.value,
              label: item?.label,
              disabled: item?.disabled
            }))}
          />
        </Form.Item>
        }

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
