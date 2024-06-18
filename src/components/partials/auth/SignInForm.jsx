import qs from "qs";
import Cookies from "js-cookie";
import { Button, Input, Modal, Form } from "antd";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/common/Loading";

const urlParamsObject = {
  populate: {
    employee_roles: {
      populate: "*",
    },
  },
};

const SignInForm = ({ apiUrl, apiToken }) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [verifiedCode, setVerifiedCode] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState();
  const [form] = Form.useForm();
  const inputRefs = useRef([]);

  useEffect(() => {
    const getUsers = async () => {
      const queryString = qs.stringify(urlParamsObject);
      const requestUrl = `${apiUrl}/api/users?${queryString}`;

      try {
        const response = await fetch(requestUrl);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  const onfinish = async (values) => {
    setLoading(true);

    const identifier = values.email;
    const password = values.password;

    const urlParamsObject = {
      populate: {
        avatar: {
          populate: "*",
        },
        background: {
          populate: "*",
        },
        brand: {
          populate: "*",
        },
        services: {
          populate: "*",
        },
        role: {
          populate: "*",
        },
      },
    };

    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${apiUrl}/api/auth/local?${queryString}`;

    try {
      const response = await fetch(`${requestUrl}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${apiToken}`,
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.jwt) {

          setUser(data?.user)
          setToken(data.jwt);
          // Request Verification
          const res = await fetch(`${apiUrl}/api/auth/request-verification`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `bearer ${apiToken}`,
            },
            body: JSON.stringify({
              identifier,
            }),
          });

          const resData = await res.json();

          setVerifiedCode(resData?.verifiedCode);
          setLoading(false);
          setIsOpen(true);


        }
      } else {
        toast.error("Invalid identifier or password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setLoading(false);
      }
    } catch (error) {
      toast.error("Not registered user", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setLoading(false);
      console.error("Error occurred during login:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
        setVerifiedCode(0);
        setLoading(false);
        setVerificationCode("");

        toast.warn("Session timeout!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }, 60000);
    }
  }, [isOpen]);

  const handleVerification = async () => {
    setLoading(true);
 
    if (verificationCode === verifiedCode) {
      setIsOpen(false);
      // Cookies.set("reef_admin_token", token);

      Cookies.set("reef_admin_token", token, { expires: 60/1440 });

      const roles = users
        ?.find((item) => item.id === user?.id)
        ?.employee_roles?.map((role) => role?.value)
        ?.toString();

      if (user?.isAdmin) {
        Cookies.set("role", "admin");

        setTimeout(() => {
          toast.success("Login as admin successfully 😎", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setTimeout(() => {
            setLoading(false);
            location.href = "/";
          }, 1500);
        }, 1000);
      } else {
        if (user.approvedAsEmployee) {
          // roleStore.set(roles);

          if (user?.approvedEmployeeRole) {
            Cookies.set("role", roles);
          } else {
            Cookies.set("role", "guest");
          }

          Cookies.set("reef_admin_token", token);

          toast.success("👌 Login successful!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setTimeout(() => {
            setLoading(false);
            location.href = "/";
          }, 1500);
        } else {
          console.log("Login successful");

          setTimeout(() => {
            toast.info("Not allowed by admin yet", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

            setTimeout(() => {
              setLoading(false);
            }, 1500);
          }, 1000);
        }
      }
    } else {
      toast.error("Verification Code not correct!", {
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
        setLoading(false);
        setIsOpen(false);
        form.resetFields();
        setVerificationCode("");
      }, 1500);
    }
  };

  const onInputKeyUp = (event, index) => {
    if (event.key === 'Enter' || event.target.value.length === 1) {
      const nextIndex = parseInt(index.slice(3, 4)) + 1;

      if (nextIndex < 4) {
        inputRefs.current[nextIndex].focus();
      }
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
          <h3 className="text-3xl font-bold mb-6">Sign In</h3>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Please input your email!",
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

          <div className="mb-5">
            Don't have an account?{" "}
            <a href="/signup" className="font-semibold text-primary">
              Register today
            </a>
          </div>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Modal
        centered
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={400}
      >
        <div className="mb-0 py-6 px-4" style={{ textAlign: "center" }}>
          <h3 className="text-3xl font-semibold mb-5">Confirmation</h3>

          <Form form={form} onFinish={handleVerification}>
            <div className="flex items-center justify-between">
              <Form.Item
                name={['tfa', '0']}
              >
                <Input
                  maxLength={1}
                  className="text-4xl"
                  style={{ width: '72px', height: "80px", textAlign: 'center' }}
                  onKeyUp={(event) => onInputKeyUp(event, 'tfa0')}
                  onChange={(e) => {
                    setVerificationCode(verificationCode.concat(e.target.value));
                  }}
                  ref={(input) => (inputRefs.current[0] = input)}
                />
              </Form.Item>

              <Form.Item
                name={['tfa', '1']}
              >
                <Input
                  maxLength={1}
                  className="text-4xl"
                  style={{ width: '72px', height: "80px", textAlign: 'center' }}
                  onKeyUp={(event) => onInputKeyUp(event, 'tfa1')}
                  onChange={(e) => {
                    setVerificationCode(verificationCode.concat(e.target.value));
                  }}
                  ref={(input) => (inputRefs.current[1] = input)}
                />
              </Form.Item>

              <Form.Item
                name={['tfa', '2']}
              >
                <Input
                  maxLength={1}
                  className="text-4xl"
                  style={{ width: '72px', height: "80px", textAlign: 'center' }}
                  onKeyUp={(event) => onInputKeyUp(event, 'tfa2')}
                  onChange={(e) => {
                    setVerificationCode(verificationCode.concat(e.target.value));
                  }}
                  ref={(input) => (inputRefs.current[2] = input)}
                />
              </Form.Item>

              <Form.Item
                name={['tfa', '3']}
              >
                <Input
                  maxLength={1}
                  className="text-4xl"
                  style={{ width: '72px', height: "80px", textAlign: 'center' }}
                  onKeyUp={(event) => onInputKeyUp(event, 'tfa3')}
                  onChange={(e) => {
                    setVerificationCode(verificationCode.concat(e.target.value));
                  }}
                  ref={(input) => (inputRefs.current[3] = input)}
                />
              </Form.Item>
            </div>

            <Form.Item className="mb-0">
              <Button type="primary" htmlType="submit" size="large">
                Verify
              </Button>
            </Form.Item>
          </Form>
        </div>

        
      </Modal>

    </>
  );
};

export default SignInForm;
