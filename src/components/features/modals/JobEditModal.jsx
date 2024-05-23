import {
  Button,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { toast } from "react-toastify";
// import { useStackEdit } from "use-stackedit";
import moment from "moment";

const JobEditModal = ({
  jobTypes,
  jobSections,
  selectedJob,
  getAllJobs,
  categories,
  apiUrl,
  apiToken,
  setOpenJobEdit,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const [date, setDate] = useState(
    moment(selectedJob?.attributes?.timeline?.value, "YYYY-MM-DD")
  );

  const onfinish = async (values) => {
    setLoading(true);

    let data = {};

    if (values?.title) {
      data = { ...data, title: values?.title };
    }

    if (values?.slug) {
      data = { ...data, slug: values?.slug };
    }

    if (values?.desc) {
      data = {
        ...data,
        jobDescription: {
          title: selectedJob?.attributes?.jobDescription?.title,
          value: values?.desc,
        },
      };
    }

    if (values?.mainDutiesAndTasks) {
      data = {
        ...data,
        mainDutiesAndTasks: {
          title: selectedJob?.attributes?.mainDutiesAndTasks?.title,
          value: values?.mainDutiesAndTasks,
        },
      };
    }

    if (values?.category) {
      data = {
        ...data,
        job_category: categories.find(
          (category) => category?.attributes?.value === values?.category
        ),
      };
    }

    if (values?.type) {
      data = {
        ...data,
        job_type: jobTypes.find(
          (type) => type?.attributes?.value === values?.type
        ),
      };
    }

    if (values?.section) {
      data = {
        ...data,
        job_section: jobSections.find(
          (section) => section?.attributes?.value === values?.section
        ),
      };
    }

    if (values?.postOwnerName) {
      data = {
        ...data,
        postOwnerName: {
          title: selectedJob?.attributes?.postOwnerName?.title,
          value: values?.postOwnerName,
        },
      };
    }

    if (values?.timeline) {
      data = {
        ...data,
        timeline: {
          title: selectedJob?.attributes?.timeline?.title,
          value: values?.timeline,
        },
      };
    }

    if (values?.practicalExperience) {
      data = {
        ...data,
        practicalExperience: {
          title: selectedJob?.attributes?.practicalExperience?.title,
          value: values?.practicalExperience,
        },
      };
    }

    try {
      await fetch(`${apiUrl}/api/jobs/${selectedJob?.id}`, {
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
      });

      await getAllJobs();

      setTimeout(() => {
        setLoading(false);
        form.resetFields();
        setOpenJobEdit(false);
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
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        form.resetFields();
        setLoading(false);
        setOpenJobEdit(false);
      }, 1500);

      toast.error("👌 Failed Update Update", {
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
      <h3 className="text-2xl font-semibold mb-6">Edit Job</h3>

      <Form
        name="basic"
        layout="vertical"
        autoComplete="off"
        initialValues={{
          title: selectedJob?.attributes?.title,
          slug: selectedJob?.attributes?.slug,
          desc: selectedJob?.attributes?.jobDescription?.value,
          mainDutiesAndTasks:
            selectedJob?.attributes?.mainDutiesAndTasks?.value,
          type: selectedJob?.attributes?.job_type?.data?.attributes?.value,
          section:
            selectedJob?.attributes?.job_section?.data?.attributes?.value,
          postOwnerName: selectedJob?.attributes?.postOwnerName?.value,
          practicalExperience:
            selectedJob?.attributes?.practicalExperience?.value,
          timeline: date,
          category:
            selectedJob?.attributes?.job_category?.data?.attributes?.value,
        }}
        onFinish={onfinish}
      >
        <div className="grid grid-flex-row grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6">
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your title!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item
              label="Slug"
              name="slug"
              rules={[
                {
                  required: true,
                  message: "Please input your slug!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Form.Item label="Category" name="category">
              <Select>
                {categories?.map((category, index) => (
                  <Select.Option
                    value={category?.attributes?.value}
                    key={index}
                  >
                    {category?.attributes?.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select>
                {jobTypes?.map((category, index) => (
                  <Select.Option
                    value={category?.attributes?.value}
                    key={index}
                  >
                    {category?.attributes?.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Form.Item
              label="Section"
              name="section"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select>
                {jobSections?.map((category, index) => (
                  <Select.Option
                    value={category?.attributes?.value}
                    key={index}
                  >
                    {category?.attributes?.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Form.Item
              label="Post Owner Name"
              name="postOwnerName"
              rules={[
                {
                  required: true,
                  message: "Please input..!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Form.Item
              label="Practical Experience"
              name="practicalExperience"
              rules={[
                {
                  required: true,
                  message: "Please input your experience!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Form.Item
              label="Timeline"
              name="timeline"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item label="Desc" name="desc">
              <Input.TextArea rows={4} placeholder="Please enter the dec" />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item label="Main Duties And Tasks" name="mainDutiesAndTasks">
              <Input.TextArea rows={4} placeholder="Please enter the body" />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default JobEditModal;
