import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { Label } from "../../../components/ui/label";

import { message, Modal, Input } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DownloadOutlined,
} from "@ant-design/icons";

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
import { toast } from "react-toastify";

const JobRequestTable = ({ role, servicesData, apiUrl, apiToken }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState(null);
  const [services, setServices] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setServices(servicesData);
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
    setService(singleService);
  };

  const getAllJobRequests = async () => {
    const urlParamsObject = {
      populate: {
        fullName: {
          populate: "*",
        },
        email: {
          populate: "*",
        },
        attachedFile: {
          populate: "*",
        },
        coverLetter: {
          populate: "*",
        },
        portfolioLink: {
          populate: "*",
        },
        phone: {
          populate: "*",
        },
      },
    };

    const data = await fetchApi({
      endpoint: "job-order-request-ids", // the content type to fetch
      query: urlParamsObject,
      apiUrl: apiUrl,
      apiToken: apiToken,
    });

    setServices(data);
  };

  const clearSteps = () => {
    setOpen(false);
  };

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleUpdateStatus = async () => {
    setLoading(true);

    let data = {};

    switch (selectedStatus) {
      case "approved":
        data = { ...data, approved: true, rejected: false };
        break;
      case "rejected":
        data = { ...data, approved: false, rejected: true };
        break;
      default:
        data = { ...data, approved: false, rejected: false };
        break;
    }

    console.log(service, selectedStatus, "serviceserviceservice");

    try {
      const req = await fetch(
        `${apiUrl}/api/job-order-request-ids/${service?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // set the auth token to the user's jwt
            Authorization: `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            data: {
              ...data,
            },
          }),
        }
      );

      if (req?.ok) {
        getAllJobRequests();

        setTimeout(() => {
          setLoading(false);
          setOpen(false);
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
      }
    } catch (error) {
      console.log(error);

      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 1500);

      toast.error("Server Error", {
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
      {loading && <Loading />}

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div className="items-center justify-between lg:flex">
          <div className="mb-4 lg:mb-0">
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              All Job Requests
            </h3>

            <Input
              className="h-[42px] w-[382px]"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search for job request by username..."
            />
          </div>
          <div className="items-center sm:flex"></div>
        </div>

        <div className="flex flex-col mt-6">
          <div className="overflow-x-auto rounded-lg">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {/* <th
                        scope="col"
                        className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                      >
                        Job ID
                      </th> */}
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
                        CV
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
                      ?.filter((item) =>
                        item?.attributes?.fullName?.value
                          ?.toLowerCase()
                          .includes(search)
                      )
                      ?.sort((a, b) => b.id - a.id)
                      ?.map((service, index) => (
                        <tr
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          key={index}
                        >
                          {/* <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                            <span className="font-semibold">
                              {service?.attributes?.jobRequestID}
                            </span>
                          </td> */}
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
                            <div className="max-w-[300px] overflow-hidden text-ellipsis">
                            {service?.attributes?.coverLetter?.value}
                            </div>
                          </td>

                          <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {service?.attributes?.attachedFile?.data ? (
                              <a
                                className="flex items-center max-w-[200px] overflow-hidden text-ellipsis"
                                target="__blank"
                                href={
                                  service?.attributes?.attachedFile?.data
                                    ?.attributes?.url
                                }
                              >
                                <DownloadOutlined />
                                <span className="mr-2">
                                  {
                                    service?.attributes?.attachedFile?.data
                                      ?.attributes?.name
                                  }
                                </span>
                              </a>
                            ) : (
                              <span>No file</span>
                            )}
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            {service?.attributes?.approved &&
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

                            {!service?.attributes?.approved &&
                              !service?.attributes?.rejected && (
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 rtl:mr-0 rtl:ml-2 px-2.5 py-0.5 rounded-md border border-purple-100 dark:bg-gray-700 dark:border-purple-500 dark:text-purple-400">
                                  In progress
                                </span>
                              )}
                          </td>

                          {role?.indexOf("guest") < 0 && (
                            <td>
                              {service?.attributes?.approved &&
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        centered
        open={open}
        onCancel={() => {
          clearSteps();
        }}
        width={500}
        footer={null}
      >
        <div className={`text-center py-4`}>
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Are u going to change the status?
          </h3>

          <Select
            className="w-full"
            defaultValue={`${
              service?.attributes?.rejected
                ? "rejected"
                : service?.attributes?.approved
                ? "approved"
                : "progress"
            }`}
            onChange={(value) => {
              setSelectedStatus(value);
            }}
            options={[
              {
                value: "progress",
                label: "In Progress",
              },
              {
                value: "approved",
                label: "Approved",
              },
              {
                value: "rejected",
                label: "Rejected",
              },
            ]}
          />

          <div className="flex items-center justify-center mt-5">
            <Button type="primary" onClick={() => handleUpdateStatus()}>
              OK
            </Button>

            <Button
              className="mr-2"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobRequestTable;
