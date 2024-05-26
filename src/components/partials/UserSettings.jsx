import { Button, Form, Input, Upload } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../common/Loading";

const UserSettings = ({ user, pageData, apiUrl, apiToken }) => {
  const [fileList, setFileList] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  useEffect(() => {
    if (fileList.length > 0) {
      //   handleImageUpload(fileList[0]);
      let reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          let src = reader.result;

          setAvatarUrl(src);
          handleImageUpload(fileList[0]);
        },
        false
      );

      reader.readAsDataURL(fileList[0]);
    }
  }, [fileList]);

  const handleImageUpload = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        console.log(data[0], "datadata")

        handleUpdateFunc({
          avatar: data[0],
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleUpdateFunc = async (data) => {
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/users/${user?.id}`, {
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

      if (res.ok) {
        toast.success("👌 Successfully Updated!", {
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
      }
    } catch (error) {
      console.error(error);

      toast.error("👌 Failed Update", {
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
    }
  };

  const handleUpdatePersonalInfo = (values) => {
    handleUpdateFunc({
      username: values?.firstName,
      address: values?.address,
      email: values?.email,
      phoneNumber: values?.phoneNumber,
    });
  };

  const handleUpdatePassword = (values) => {
    handleUpdateFunc({
      password: values?.password,
    });
  };

  console.log(user, "fileListfileList");

  return (
    <>
      {loading && <Loading />}

      <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        <div className="mb-4 col-span-full xl:mb-2">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            User Settings
          </h1>
        </div>

        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center sm:flex xl:block 2xl:flex">
              <img
                className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0"
                src={`${
                  avatarUrl
                    ? avatarUrl
                    : user?.avatar?.url
                }`}
                alt="Jese picture"
              />
              <div className="rtl:mr-4">
                <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                  {pageData?.profilePictureTitle}
                </h3>
                <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 800K
                </div>
                <div className="flex items-center">
                  <Upload {...props}>
                    <Button type="primary">
                      {pageData?.editProfilePicture}
                    </Button>
                  </Upload>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              {pageData?.profileInformation}
            </h3>
            <Form
              initialValues={{
                firstName: user?.username,
                address: user?.address,
                email: user?.email,
                phoneNumber: user?.mobileNumber,
              }}
              onFinish={handleUpdatePersonalInfo}
              layout="vertical"
            >
              <div className="grid grid-flex-row grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <Form.Item
                    name="firstName"
                    label={pageData?.firstName?.title}
                  >
                    <Input placeholder={pageData?.firstName?.value} />
                  </Form.Item>
                </div>

                {/* <div className="col-span-12 md:col-span-6">
                  <Form.Item name="lastName" label={pageData?.lastName?.title}>
                    <Input placeholder={pageData?.lastName?.value} />
                  </Form.Item>
                </div> */}

                <div className="col-span-12 md:col-span-6">
                  <Form.Item name="address" label={"عنوان"}>
                    <Input placeholder={"e.g. California"} />
                  </Form.Item>
                </div>

                {/* <div className="col-span-12 md:col-span-6">
                  <Form.Item name="title" label={pageData?.title?.title}>
                    <Input placeholder={pageData?.title?.value} />
                  </Form.Item>
                </div> */}

                <div className="col-span-12 md:col-span-6">
                  <Form.Item
                    name="email"
                    label={pageData?.email?.title}
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
                    <Input placeholder={pageData?.email?.value} />
                  </Form.Item>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <Form.Item
                    name="phoneNumber"
                    label={pageData?.phoneNumber?.title}
                  >
                    <Input placeholder={pageData?.phoneNumber?.value} />
                  </Form.Item>
                </div>

                <div className="col-span-12">
                  <Form.Item className="mb-0">
                    <Button type="primary" htmlType="submit">
                      احفظ الكل
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>

          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              {pageData?.Password}
            </h3>

            <Form onFinish={handleUpdatePassword} layout="vertical">
              <div className="grid grid-flex-row grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <Form.Item
                    label={pageData?.newPassword?.title}
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
                </div>

                <div className="col-span-12 md:col-span-6">
                  <Form.Item
                    label="تأكيد كلمة المرور"
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

                <div className="col-span-12">
                  <Form.Item className="mb-0">
                    <Button type="primary" htmlType="submit">
                      احفظ الكل
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSettings;
