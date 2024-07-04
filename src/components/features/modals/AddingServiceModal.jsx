import {
  Button,
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

const AddingServiceModal = ({
  getAllServices,
  categories,
  apiUrl,
  apiToken,
  setOpenCustomerModal,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const [textAreaValue, setTextAreaValue] = useState("");
  // const { openStackedit, onFileChange } = useStackEdit(setValue);
  const [fileList, setFileList] = useState([]);
  const [mediaUrl, setMediaUrl] = useState(null);
  const formRef = useRef(null);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

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

          setMediaUrl(src);
        },
        false
      );

      reader.readAsDataURL(fileList[0]);
    }
  }, [fileList]);

  const onReset = () => {
    formRef.current.resetFields();
    setMediaUrl(null);
  };

  const onfinish = async (values) => {
    setLoading(true);

    let data = {};

    if (values?.title) {
      data = { ...data, title: values?.title, slug: values?.title?.toLowerCase().replaceAll(" ", "-").replaceAll(".", "") };
    }

    if (values?.desc) {
      data = { ...data, desc: values?.desc };
    }

    if (values?.body) {
      data = { ...data, body: values?.body };
    }

    if (values?.category) {
      data = {
        ...data,
        category: categories.find(
          (category) => category?.attributes?.value === values?.category
        ),
      };
    }

    if (values?.workingDay) {
      data = { ...data, workingDay: values?.workingDay };
    }

    if (values?.type) {
      data = { ...data, type: values?.type };
    }

    const formData = new FormData();
    formData.append("files", fileList[0]);

    try {
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        message.success(`${fileList[0].name} file uploaded successfully`);
        const image = await res.json();

        data = { ...data, media: { image, alt: "Media" } };

        await fetch(`${apiUrl}/api/services`, {
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

        await getAllServices();

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
      }
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        setLoading(false);
        onReset();
        setOpenCustomerModal(false);
      }, 1500);

      toast.error("👌 Failed User Update", {
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
      <h3 className="text-2xl font-semibold mb-6">اضافة خدمة جديدة</h3>

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
              label="العنوان"
              name="title"
              rules={[
                {
                  required: true,
                  message: "الرجاء اضافة العنوان!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item label="الفئة" name="category">
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

          <div className="col-span-12 sm:col-span-6">
            <Form.Item
              label="الحالة"
              name="type"
              rules={[
                {
                  required: true,
                  message: "الرجاء اضافة الحالة!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Form.Item
              label="مدة تنفيذ الخدمة"
              name="workingDay"
              rules={[
                {
                  required: true,
                  message: "الرجاء اضافة مدة تنفيذ الخدمة!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item label="الوصف" name="desc">
              <Input.TextArea rows={6} placeholder="رجاء اضافة الوصف..." />
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item label="المحتوى" name="body">
              <Input.TextArea
                rows={6}
                onChange={(e) => setTextAreaValue(e.target.value)}
                placeholder="رجاء اضافة المحتوى..."
              />
              {/* <ReactMarkdown>{textAreaValue}</ReactMarkdown> */}
            </Form.Item>
            {/* <Form.Item label="Body(Markdown)" name="body">
              <Input.TextArea
                rows={6}
                onChange={(e) => {
                  setValue(e.target.value);
                  onFileChange();
                }}
              />
            </Form.Item> */}
            {/* <label>Body(Markdown)</label>
            <textarea
              className="cursor-pointer mt-2 block w-full p-3 border hover:border-primary focus:outline-primary mb-3"
              value={value}
              rows={6}
              placeholder="Please enter the dec"
              onClick={() => {
                openStackedit({
                  content: {
                    // Markdown content.
                    text: value,
                  },
                });
              }}
              // onChange={(e) => {
              //   setValue(e.target.value);

              //   // If textarea is edited run the file change event on stackedit
              //   onFileChange();
              // }}
            ></textarea> */}

            {/* <Button
              type="primary"
              onClick={() => {
                openStackedit({
                  content: {
                    // Markdown content.
                    text: value,
                  },
                });
              }}
            >
              Open Markdown Editor
            </Button> */}
          </div>

          <div className="col-span-12 flex items-center">
            <Form.Item
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  message: "الرجاء اضافة ملف !",
                },
              ]}
            >
              <Upload {...props}>
                <Button className="bg-white text-black hover:bg-white hover:text-primary">
                  اضافة ملف
                </Button>
              </Upload>
            </Form.Item>

            {mediaUrl && (
              <img
                className="mb-4 rounded-lg w-28 h-28 sm:mb-0 xl:mb-4 2xl:mb-0 object-contain mx-4"
                src={`${mediaUrl}`}
                alt="Jese picture"
              />
            )}
          </div>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            اضافة الخدمة
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddingServiceModal;
