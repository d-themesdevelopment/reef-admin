import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

import { message, Modal, Input } from "antd";
import { Button } from "antd";
import Loading from "../../../components/common/Loading";
import fetchApi from "../../../lib/strapi";
import AddingJobModal from "../../features/modals/AddingJobModal";
import JobEditModal from "../../../components/features/modals/JobEditModal";

const JobTable = ({ role, jobsData, apiUrl, apiToken }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openJobDelete, setOpenJobDelete] = useState(false);
  const [selectedJob, setSelectedJob] = useState();
  const [openJobEdit, setOpenJobEdit] = useState(false);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobSections, setJobSections] = useState([]);

  console.log(role, "rolerolerole");

  useEffect(() => {
    getJobTypes();
    getCategories();
    getJobSections();
    setJobs(jobsData);
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

  const handleDeleteJob = async (Job) => {
    setLoading(true);

    const response = await fetch(`${apiUrl}/api/jobs/${Job?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`, // Replace with your Strapi JWT token
      },
    });

    if (response.ok) {
      getAllJobs();

      setTimeout(() => {
        setLoading(false);
        setOpenJobDelete(false);
      }, 1500);

      toast.success("👌 Job deleted successfully!", {
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
      console.error("Error deleting Job");
      setTimeout(() => {
        setLoading(false);
        setOpenJobDelete(false);
      }, 1500);

      toast.error("Error deleting Job!", {
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

  const getAllJobs = async () => {
    const urlParamsObject = {
      populate: {
        job_category: {
          populate: "*",
        },
        applyButton: {
          populate: "*",
        },
        postOwnerName: {
          populate: "*",
        },
        timeline: {
          populate: "*",
        },
        mainDutiesAndTasks: {
          populate: "*",
        },
        jobDescription: {
          populate: "*",
        },
        practicalExperience: {
          populate: "*",
        },
        job_section: {
          populate: "*",
        },
        job_type: {
          populate: "*",
        },
      },
    };

    const data = await fetchApi({
      endpoint: "jobs", // the content type to fetch
      query: urlParamsObject,
      apiUrl: apiUrl,
      apiToken: apiToken,
    });

    setJobs(data);
  };

  const getCategories = async () => {
    const urlParamsObject = {
      populate: "*",
    };

    const data = await fetchApi({
      endpoint: "job-categories", // the content type to fetch
      query: urlParamsObject,
      apiUrl: apiUrl,
      apiToken: apiToken,
    });

    setCategories(data);
  };

  const getJobTypes = async () => {
    const urlParamsObject = {
      populate: "*",
    };

    const data = await fetchApi({
      endpoint: "job-types", // the content type to fetch
      query: urlParamsObject,
      apiUrl: apiUrl,
      apiToken: apiToken,
    });

    setJobTypes(data);
  };

  const getJobSections = async () => {
    const urlParamsObject = {
      populate: "*",
    };

    const data = await fetchApi({
      endpoint: "job-sections", // the content type to fetch
      query: urlParamsObject,
      apiUrl: apiUrl,
      apiToken: apiToken,
    });

    setJobSections(data);
  };

  const [search, setSearch] = useState("");

  return (
    <>
      {loading && <Loading />}

      <div className="items-end justify-between lg:flex">
        <div className="mb-4 lg:mb-0">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            All jobs
          </h3>
          {/* <span className="text-base font-normal text-gray-500 dark:text-gray-400">
            This is a list of latest jobs
          </span> */}

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
              Add Job
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
                      Title
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      Desc
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      Category
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      Job Section
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      Job Type
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left rtl:text-right text-gray-500 uppercase dark:text-white"
                    >
                      Timeline
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
                  {jobs
                    ?.filter((item) =>
                      item?.attributes?.title?.toLowerCase().includes(search)
                    )
                    ?.sort((a, b) => b.id - a.id)
                    ?.map((Job, index) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        key={index}
                      >
                        <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                          <span className="font-semibold flex items-center">
                            {Job?.attributes?.title}
                          </span>
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          <div className="max-w-[500px] overflow-hidden text-ellipsis">
                            {Job?.attributes?.jobDescription?.value}
                          </div>
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          {
                            Job?.attributes?.job_category?.data?.attributes
                              ?.title
                          }
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          <div className="max-w-[500px] overflow-hidden text-ellipsis">
                            {
                              Job?.attributes?.job_section?.data?.attributes
                                .title
                            }
                          </div>
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          <div className="max-w-[500px] overflow-hidden text-ellipsis">
                            {Job?.attributes?.job_type?.data?.attributes.title}
                          </div>
                        </td>

                        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                          <div className="max-w-[500px] overflow-hidden text-ellipsis">
                            {Job?.attributes?.timeline.value.slice(0, 10)}
                          </div>
                        </td>

                        {role?.indexOf("guest") < 0 && (
                          <td className="flex items-center">
                            <td className="p-4 space-x-2 whitespace-nowrap">
                              <Button
                                type="primary"
                                onClick={() => {
                                  setOpenJobEdit(true);
                                  setSelectedJob(Job);
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
                                Edit Job
                              </Button>
                              <Button
                                onClick={() => {
                                  setOpenJobDelete(true);
                                  setSelectedJob(Job);
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
                                Delete Job
                              </Button>
                            </td>
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
        open={openCustomerModal}
        onCancel={() => {
          setOpenCustomerModal(false);
        }}
        width={700}
        footer={null}
      >
        <AddingJobModal
          apiUrl={apiUrl}
          setLoading={setLoading}
          apiToken={apiToken}
          jobTypes={jobTypes}
          jobSections={jobSections}
          categories={categories}
          getAllJobs={getAllJobs}
          setOpenCustomerModal={setOpenCustomerModal}
        />
      </Modal>

      <Modal
        centered
        open={openJobEdit}
        onCancel={() => {
          setOpenJobEdit(false);
        }}
        width={700}
        footer={null}
      >
        <JobEditModal
          jobTypes={jobTypes}
          jobSections={jobSections}
          jobs={jobs}
          setJobs={setJobs}
          getAllJobs={getAllJobs}
          categories={categories}
          selectedJob={selectedJob}
          setLoading={setLoading}
          apiUrl={apiUrl}
          apiToken={apiToken}
          setOpenJobEdit={setOpenJobEdit}
        />
      </Modal>

      <Modal
        centered
        open={openJobDelete}
        onCancel={() => {
          setOpenJobDelete(false);
        }}
        width={300}
        footer={null}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center">Are u sure?</h3>

        <div className="flex items-center justify-center">
          <Button type="primary" onClick={() => handleDeleteJob(selectedJob)}>
            OK
          </Button>
          <Button className="mr-2" onClick={() => setOpenJobDelete(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default JobTable;
