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
import { useEffect, useRef, useState } from "react";
import Loading from "../Loading";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
// import { useStackEdit } from "use-stackedit";

const AddingJobModal = ({
  getAllJobs,
  categories,
  jobTypes,
  jobSections,
  apiUrl,
  apiToken,
  setOpenCustomerModal,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [textAreaValue, setTextAreaValue] = useState("");
  // const { openStackedit, onFileChange } = useStackEdit(setValue);
  const [fileList, setFileList] = useState([]);
  const [mediaUrl, setMediaUrl] = useState(null);

  const onReset = () => {
    formRef.current.resetFields();
    setMediaUrl(null);
  };


  useEffect(() => {
    if (fileList.length > 0) {
      //   handleImageUpload(fileList[0]);
      let reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          let src = reader.result;

          setMediaUrl(src);
        },
        false
      );

      reader.readAsDataURL(fileList[0]);
    }
  }, [fileList]);

  const onfinish = async (values) => {
    setLoading(true);

    let data = {};

    if (values?.title) {
      data = { ...data, title: values?.title, slug: values?.title?.toLowerCase().replaceAll(" ", "-").replaceAll(".", "") };
    }

    if (values?.desc) {
      data = {
        ...data,
        jobDescription: { title: "Job Description", value: values?.desc },
      };
    }

    if (values?.mainDutiesAndTasks) {
      data = {
        ...data,
        mainDutiesAndTasks: {
          title: "Main Duties And Tasks",
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
          title: "Named",
          value: values?.postOwnerName,
        },
      };
    }

    if (values?.timeline) {
      data = {
        ...data,
        timeline: {
          title: "Timeline",
          value: values?.timeline,
        },
      };
    }

    if (values?.practicalExperience) {
      data = {
        ...data,
        practicalExperience: {
          title: "Timeline",
          value: values?.practicalExperience,
        },
      };
    }

    data = {
      ...data,
      sectionTitle: "Section",
      employmentTypeTitle: "Type of the employment",
      applyButton: { title: "Apply Now" },
    };

    try {
      await fetch(`${apiUrl}/api/jobs`, {
        method: "POST",
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
        onReset();
        setOpenCustomerModal(false);
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
        setLoading(false);
        onReset();
        setOpenCustomerModal(false);
      }, 1500);

      toast.error("👌 Failed Job", {
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
      <h3 className="text-2xl font-semibold mb-6">Post New Job</h3>

      <Form
        ref={formRef}
        name="basic"
        layout="vertical"
        autoComplete="off"
        onFinish={onfinish}
        className="create-service-modal"
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
              <Input.TextArea
                rows={4}
                onChange={(e) => setTextAreaValue(e.target.value)}
                placeholder="Please enter the body"
              />
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

export default AddingJobModal;
