import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

import { message, Modal, Input } from "antd";
import { Button } from "antd";
import Loading from "../../../components/common/Loading";
import fetchApi from "../../../lib/strapi";
import AddingServiceModal from "../../../components/features/modals/AddingServiceModal";
import ServiceEditModal from "../../../components/features/modals/ServiceEditModal";

const ServiceTable = ({ role, servicesData, apiUrl, apiToken }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openServiceDelete, setOpenServiceDelete] = useState(false);
  const [selectedService, setSelectedService] = useState();
  const [openServiceEdit, setOpenServiceEdit] = useState(false);

  useEffect(() => {
    getCategories();
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

  const handleDeleteService = async (service) => {
    setLoading(true);

    const response = await fetch(`${apiUrl}/api/services/${service?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`, // Replace with your Strapi JWT token
      },
    });

    if (response.ok) {
      getAllServices();

      setTimeout(() => {
        setLoading(false);
        setOpenServiceDelete(false);
      }, 1500);

      toast.success("👌 Service deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      console.error("Error deleting Service");
      setTimeout(() => {
        setLoading(false);
        setOpenServiceDelete(false);
      }, 1500);

      toast.error("Error deleting Service!", {
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

  const getAllServices = async () => {
    const urlParamsObject = {
      populate: {
        user: {
          populate: "*",
        },
        media: {
          populate: "*",
        },
        category: {
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
      endpoint: "services", // the content type to fetch
      query: urlParamsObject,
      apiUrl: apiUrl,
      apiToken: apiToken,
    });

    setServices(data);
  };

  const getCategories = async () => {
    const urlParamsObject = {
      populate: {
        media: {
          populate: "*",
        },
        logo: {
          populate: "*",
        },
        background: {
          populate: "*",
        },
        services: {
          populate: "*",
        },
        specialties: {
          populate: "*",
        },
      },
    };

    const data = await fetchApi({
      endpoint: "categories", // the content type to fetch
      query: urlParamsObject,
      apiUrl: apiUrl,
      apiToken: apiToken,
    });

    setCategories(data);
  };

  const [search, setSearch] = useState("");
  const [openViewModal, setOpenViewModal] = useState(false);

  return (
    <>
      {loading && <Loading />}

      <div className="items-end justify-between lg:flex">
        <div className="mb-4 lg:mb-0">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            الخدمات
          </h3>
          <Input
            className="h-[42px] w-[382px]"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search..."
          />
        </div>

        <div className="items-center sm:flex">
          {role?.indexOf("guest") < 0 && (
            <Button
              type="primary"
              onClick={() => {
                setOpenCustomerModal(true);
              }}
              className="inline-flex items-center justify-center px-3 py-3 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <svg
                className="w-5 h-5 mr-2 -ml-1 rtl:ml-2 rtl:-mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              اضافة خدمة
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col mt-6">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      عنوان الخدمة
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      وصف الخدمة
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      الفئة
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      مدة تنفيذ الخدمة
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      الحالة
                    </th>

                    {role?.indexOf("guest") < 0 && (
                      <th
                        scope="col"
                        className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                      >
                        الاجرائات
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {services
                    ?.filter((item) =>
                      item?.attributes?.title?.toLowerCase().includes(search)
                    )
                    ?.sort((a, b) => b.id - a.id)
                    ?.map((service, index) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => { setOpenViewModal(true); setSelectedService(service);}}
                        key={index}
                      >
                        <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <span className="font-semibold flex items-center">
                            {service?.attributes?.media ? (
                              <img
                                className="w-10 h-10 rounded-full rtl:ml-3"
                                src={
                                  service?.attributes?.media?.image?.data
                                    ?.attributes?.url
                                }
                                alt={`avatar`}
                              />
                            ) : (
                              <div className="flex items-center justify-center font-semibold text-xl w-10 h-10 rounded-full rtl:ml-6 bg-gray-200">
                                ?
                              </div>
                            )}

                            {service?.attributes?.title}
                          </span>
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          <div className="max-w-[500px] overflow-hidden text-ellipsis">
                            {service?.attributes?.desc}
                          </div>
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {
                            service?.attributes?.category?.data?.attributes
                              ?.title
                          }
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          <div className="max-w-[500px] overflow-hidden text-ellipsis">
                            {service?.attributes?.workingDay}
                          </div>
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          <div className="max-w-[500px] overflow-hidden text-ellipsis">
                            {service?.attributes?.type}
                          </div>
                        </td>

                        {role?.indexOf("guest") < 0 && (
                          <td className="flex items-center p-4 space-x-2 whitespace-nowrap">
                            <Button
                              type="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenServiceEdit(true);
                                setSelectedService(service);
                              }}
                              className="ml-2 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                              <svg
                                className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <>
                                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                    clipRule="evenodd"
                                  />
                                </>
                              </svg>
                              تعديل
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenServiceDelete(true);
                                setSelectedService(service);
                              }}
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center !text-white !border-red-600 bg-red-600 rounded-lg hover:!bg-red-800 focus:!ring-4 focus:!ring-red-300 dark:focus:!ring-red-900"
                            >
                              <svg
                                className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              حذف
                            </Button>
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

      <Modal
        centered
        open={openViewModal}
        onCancel={() => {
          setOpenViewModal(false);
        }}
        width={600}
        footer={null}
      >
        <div className="py-5">
          <div className="grid grid-flex-row grid-cols-12 gap-5">
            <div className="col-span-12">
              <h4 className="text-2xl font-semibold mb-2">عنوان</h4>
              <span className="font-semibold flex items-center">
                {selectedService?.attributes?.media ? (
                  <img
                    className="w-10 h-10 rounded-full rtl:ml-3"
                    src={
                      selectedService?.attributes?.media?.image?.data
                        ?.attributes?.url
                    }
                    alt={`avatar`}
                  />
                ) : (
                  <div className="flex items-center justify-center font-semibold text-xl w-10 h-10 rounded-full rtl:ml-6 bg-gray-200">
                    ?
                  </div>
                )}

                {selectedService?.attributes?.title}
              </span>
            </div>

            <div className="col-span-12 md:col-span-6">
                <h4 className="text-2xl font-semibold mb-2">فئة</h4>
                <h5 className="text-lg">{selectedService?.attributes?.category?.data?.attributes?.title}</h5>
            </div>

            <div className="col-span-12 md:col-span-6">
                <h4 className="text-2xl font-semibold mb-2">يوم عمل</h4>
                <h5 className="text-lg">{selectedService?.attributes?.workingDay}</h5>
            </div>

            <div className="col-span-12 md:col-span-6">
                <h4 className="text-2xl font-semibold mb-2">الحالة</h4>
                <h5 className="text-lg">{selectedService?.attributes?.type}</h5>
            </div>

            <div className="col-span-12">
                <h4 className="text-2xl font-semibold mb-2">وصف</h4>
                <h5 className="text-lg">{selectedService?.attributes?.desc}</h5>
            </div>
          </div>
        </div>
      </Modal>


      <Modal
        centered
        open={openCustomerModal}
        onCancel={() => {
          setOpenCustomerModal(false);
        }}
        width={500}
        footer={null}
      >
        <AddingServiceModal
          apiUrl={apiUrl}
          setLoading={setLoading}
          apiToken={apiToken}
          categories={categories}
          getAllServices={getAllServices}
          setOpenCustomerModal={setOpenCustomerModal}
        />
      </Modal>

      <Modal
        centered
        open={openServiceEdit}
        onCancel={() => {
          setOpenServiceEdit(false);
        }}
        width={500}
        footer={null}
      >
        <ServiceEditModal
          services={services}
          setServices={setServices}
          getAllServices={getAllServices}
          categories={categories}
          selectedService={selectedService}
          setLoading={setLoading}
          apiUrl={apiUrl}
          apiToken={apiToken}
          setOpenServiceEdit={setOpenServiceEdit}
        />
      </Modal>

      <Modal
        centered
        open={openServiceDelete}
        onCancel={() => {
          setOpenServiceDelete(false);
        }}
        width={300}
        footer={null}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center">متأكد من حذف الخدمة؟</h3>

        <div className="flex items-center justify-center">
          <Button
            type="primary"
            onClick={() => handleDeleteService(selectedService)}
          >
            تأكيد
          </Button>
          <Button className="mr-2" onClick={() => setOpenServiceDelete(false)}>
            الغاء
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ServiceTable;
