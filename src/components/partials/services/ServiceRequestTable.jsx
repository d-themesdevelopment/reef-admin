import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { Label } from "../../../components/ui/label";

import { message, Modal, Input } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  ColorPicker,
  Form,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Upload,
} from "antd";
import Loading from "../../../components/common/Loading";
import fetchApi from "../../../lib/strapi";

const { TextArea } = Input;

const StyledSwitch = styled(Switch)`
  &.ant-switch-checked {
    background-color: #ff0000; // Change this to your desired color
  }

  &.ant-switch-checked:hover:not(.ant-switch-disabled) {
    background-color: #ff0000; // Change this to your desired color
  }
`;

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const ServiceRequestTable = ({
  role,
  servicesData,
  strapiUrl,
  strapiToken,
}) => {
  const [currentDate, setCurrentDate] = useState(null);
  const [confirmation, setConfirmation] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [services, setServices] = useState(null);
  const [textArea, setTextArea] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    setServices(servicesData);
    setCurrentDate(formattedDate);
  }, []);

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

  const handleUpdateService = (singleService) => {
    // handleUpload();
    // const asyncFuc = async () => {
    //   try {
    //     const res = await fetch(`${strapiUrl}/api/services`);
    //   } catch (error) {
    //     console.log("Error:", error);
    //   }
    // };

    setService(singleService);
  };

  const clearSteps = () => {
    setStep(0);
    setOpen(false);
    setConfirmation(true);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const getAllServices = async () => {
    const urlParamsObject = {
      populate: {
        user: {
          populate: "*",
        },
        personalInformation: {
          populate: "*",
        },
        requestInformation: {
          populate: "*",
        },
      },
    };

    const data = await fetchApi({
      endpoint: "service-orders", // the content type to fetch
      query: urlParamsObject,
      apiUrl: strapiUrl,
      apiToken: strapiToken,
    });

    setServices(data);

    console.log(data, "datadatadatadata");
  };

  const onFinish = async (values) => {
    setLoading(true);
    setTextArea(values?.message);

    if (confirmation) {
      const formData = new FormData();
      formData.append("files", fileList[0]);

      // You can use any AJAX library you like
      try {
        const res = await fetch(`${strapiUrl}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          message.success(`${fileList[0].name} file uploaded successfully`);

          const image = await res.json();

          const data = {
            attachedFile: image,
            confirmation: confirmation,
            rejected: !confirmation,
            message: values.message,
          };

          await fetch(`${strapiUrl}/api/service-orders/${service.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // set the auth token to the user's jwt
              Authorization: `Bearer ${strapiToken}`,
            },
            body: JSON.stringify({
              data: data,
            }),
          });

          await getAllServices();
          setStep(2);
          setLoading(false);
        } else {
          message.error(`${fileList[0].name} file upload failed.`);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      const data = {
        confirmation: confirmation,
        message: values.message,
        rejected: !confirmation,
      };

      try {
        await fetch(`${strapiUrl}/api/service-orders/${service.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${strapiToken}`,
          },
          body: JSON.stringify({
            data: data,
          }),
        });

        await getAllServices();
        setStep(2);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading && <Loading />}

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Service ID
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Service Name
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Date &amp; Time
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Username
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Applicant Category
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Status
            </th>
            {role?.indexOf("guest") < 0 && (
              <th
                scope="col"
                className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          {services
            ?.sort((a, b) => b.id - a.id)
            ?.map((service, index) => (
              <tr
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
                key={index}
              >
                <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                  <span className="font-semibold">
                    {service?.attributes?.serviceID}
                  </span>
                </td>
                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service?.attributes?.serviceName}
                </td>
                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service?.attributes?.createdAt.slice(0, 10)}
                </td>
                <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                  {service?.attributes?.user?.data?.attributes?.username}
                </td>
                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service?.attributes?.requestInformation?.applicantCategory}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {service?.attributes?.confirmation &&
                    !service?.attributes?.rejected && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 rtl:mr-0 rtl:ml-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                        Completed
                      </span>
                    )}

                  {service?.attributes?.rejected && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 rtl:mr-0 rtl:ml-2 px-2.5 py-0.5 rounded-md border border-red-100 dark:border-red-400 dark:bg-gray-700 dark:text-red-400">
                      Rejected
                    </span>
                  )}

                  {!service?.attributes?.confirmation &&
                    !service?.attributes?.rejected && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 rtl:mr-0 rtl:ml-2 px-2.5 py-0.5 rounded-md border border-purple-100 dark:bg-gray-700 dark:border-purple-500 dark:text-purple-400">
                        In progress
                      </span>
                    )}
                </td>
                
                {role?.indexOf("guest") < 0 && (
                  <td>
                    {service?.attributes?.confirmation &&
                    !service?.attributes?.rejected ? (
                      <span className="text-green-800 text-success border-black font-semibold">
                        Done
                      </span>
                    ) : (
                      <Button
                        className="bg-red-500 border-red-500 text-white font-semibold"
                        onClick={() => {
                          setOpen(true);
                          handleUpdateService(service);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      <Modal
        centered
        open={open}
        onCancel={() => {
          clearSteps();
        }}
        width={500}
        footer={null}
      >
        <div className={`text-center ${step === 2 ? "py-10" : "py-5"}`}>
          {step !== 2 && (
            <>
              <h2 className="font-bold text-3xl text-center mb-7">
                {service?.attributes?.serviceName}
              </h2>

              <div className="flex items-center justify-center mb-10">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center  font-bold w-10 h-10  rounded-full ${
                      step === 0 ? "bg-primary text-white" : "bg-gray-200"
                    }`}
                  >
                    1
                  </div>

                  <h4 className="mr-2 font-bold">تقدم</h4>
                </div>

                <div className="flex items-center mx-16">
                  <div
                    className={`flex items-center justify-center  font-bold w-10 h-10  rounded-full ${
                      step === 1 ? "bg-primary text-white" : "bg-gray-200"
                    }`}
                  >
                    2
                  </div>

                  <h4 className="mr-2 font-bold">الدفع</h4>
                </div>

                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center  font-bold w-10 h-10  rounded-full ${
                      step === 2 ? "bg-primary text-white" : "bg-gray-200"
                    }`}
                  >
                    3
                  </div>

                  <h4 className="mr-2 font-bold">مكتمل</h4>
                </div>
              </div>
            </>
          )}

          {step === 0 && (
            <>
              <div className="text-center grid grid-flex-row grid-cols-12 gap-4 justify-center">
                <div className="col-span-6">
                  <h4 className="font-bold">الاسم الأول</h4>
                  <h3>{service?.attributes?.personalInformation?.firstName}</h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">اسم العائلة</h4>
                  <h3>{service?.attributes?.personalInformation?.lastName}</h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">اسم الأب</h4>
                  <h3>
                    {service?.attributes?.personalInformation?.fatherName}
                  </h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">اسم جده</h4>
                  <h3>
                    {service?.attributes?.personalInformation?.grandFatherName}
                  </h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">بريد إلكتروني</h4>
                  <h3>{service?.attributes?.personalInformation?.email}</h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">عنوان</h4>
                  <h3>{service?.attributes?.personalInformation?.address}</h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">رقم الهوية</h4>
                  <h3>{service?.attributes?.personalInformation?.idNumber}</h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">رقم الهوية</h4>
                  <h3>
                    {service?.attributes?.personalInformation?.mobileNumber}
                  </h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">فئة مقدم الطلب</h4>
                  <h3>
                    {service?.attributes?.requestInformation?.applicantCategory}
                  </h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">تخصص مقدم الطلب</h4>
                  <h3>{service?.attributes?.requestInformation?.specialty}</h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">نوع المؤهل</h4>
                  <h3>
                    {service?.attributes?.requestInformation?.qualificationType}
                  </h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">مؤهل</h4>
                  <h3>
                    {service?.attributes?.requestInformation?.qualificationDesc}
                  </h3>
                </div>

                <div className="col-span-6">
                  <h4 className="font-bold">الحالة المهنية لمقدم الطلب</h4>
                  <h3>
                    {
                      service?.attributes?.requestInformation
                        ?.professionalStatus
                    }
                  </h3>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Button
                  size="large"
                  type="primary"
                  onClick={() => {
                    setStep(1);
                  }}
                >
                  ابدأ العمل على الخدمة
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Form
                name="validate_other"
                onFinish={onFinish}
                initialValues={{
                  "input-number": 3,
                  "checkbox-group": ["A", "B"],
                }}
              >
                <Form.Item
                  name="confirmation"
                  rules={[
                    {
                      required: true,
                      message: "Please pick an item!",
                    },
                  ]}
                >
                  <Radio.Group
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                  >
                    <Radio.Button value={true}>يقبل</Radio.Button>
                    <Radio.Button value={false}>رفض</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="message"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input.TextArea rows={6} placeholder="اكتب رسالتك هنا" />
                </Form.Item>

                {confirmation && (
                  <Form.Item
                    name="upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    {/* <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload> */}

                    <Upload {...props}>
                      <Button className="underline bg-white text-black hover:bg-white hover:text-primary">
                        تحميل ملف PDF
                      </Button>
                    </Upload>
                  </Form.Item>
                )}

                <Form.Item
                  style={{ marginBottom: 0 }}
                  wrapperCol={{
                    span: 12,
                    offset: 6,
                  }}
                >
                  <Space style={{ marginTop: 30 }}>
                    <Button size="large" type="primary" htmlType="submit">
                      يُقدِّم
                    </Button>
                    <Button
                      size="large"
                      htmlType="reset"
                      onClick={() => setStep(0)}
                    >
                      خلف
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </>
          )}

          {step === 2 && (
            <div>
              {confirmation ? (
                <>
                  <CheckCircleFilled
                    className="mb-3"
                    style={{ color: "hsl(var(--primary))", fontSize: 76 }}
                  />

                  <p className="text-primary font-bold text-4xl mb-3">قبلت</p>
                </>
              ) : (
                <>
                  <CloseCircleFilled
                    className="mb-3"
                    style={{ color: "red", fontSize: 76 }}
                  />

                  <p className="text-red-500 font-bold text-4xl mb-3">رفض</p>
                </>
              )}

              <h2 className="text-xl font-bold mb-2">{service.serviceName}</h2>
              <h3 className="font-semibold mb-3">{service.serviceID}</h3>

              <p className="mb-6">You rejected this service request</p>

              <div className="max-w-[240px] mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold">اسم الموظف:</h4>

                  <h4 className="text-base">Adam</h4>
                </div>

                <div className="flex items-center justify-between mx-4">
                  <h4 className="text-base font-medium">تاريخ بدء الخدمة:</h4>

                  <h4 className="text-base">{currentDate}</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ServiceRequestTable;
