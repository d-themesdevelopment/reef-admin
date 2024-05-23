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

const JobRequestTable = ({ servicesData, strapiUrl, strapiToken }) => {
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
              Job ID
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Job Title
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
              Email
            </th>

            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Phone
            </th>

            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              coverLetter
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            >
              Status
            </th>

            <th
              scope="col"
              className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
            ></th>
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
                    {service?.attributes?.jobRequestID}
                  </span>
                </td>
                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service?.attributes?.jobTitle}
                </td>
                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service?.attributes?.fullName?.value}
                </td>
                <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                  {service?.attributes?.email?.value}
                </td>
                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service?.attributes?.phone?.value}
                </td>

                <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {service?.attributes?.coverLetter?.value}
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
         
        </div>
      </Modal>
    </>
  );
};

export default JobRequestTable;
