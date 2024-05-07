import { Button, Upload } from "antd";
import { useEffect, useState } from "react";

const UserSettings = ({ pageData, apiUrl, apiToken }) => {
  const [fileList, setFileList] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

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
    const formData = new FormData();
    formData.append("files", file);

    try {
      await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  console.log(fileList, "fileListfileList");

  return (
    <>
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
                    : "https://flowbite-admin-dashboard.vercel.app/images/users/bonnie-green-2x.png"
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

          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="flow-root">
              <h3 className="text-xl font-semibold dark:text-white">
                Other accounts
              </h3>
              <ul className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-4">
                  <div className="flex justify-between xl:block 2xl:flex align-center 2xl:space-x-4">
                    <div className="flex xl:mb-4 2xl:mb-0">
                      <div className="rtl:ml-4">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={
                            "https://flowbite-admin-dashboard.vercel.app/images/users/bonnie-green-2x.png"
                          }
                          alt="Bonnie image"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 leading-none truncate mb-0.5 dark:text-white">
                          Bonnie Green
                        </p>
                        <p className="mb-1 text-sm font-normal truncate text-primary-700 dark:text-primary-500">
                          New York, USA
                        </p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Last seen: 1 min ago
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center w-auto xl:w-full 2xl:w-auto">
                      <a
                        href="#"
                        className="w-full px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        Disconnect
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
              <div>
                <Button type="primary">احفظ الكل</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              {pageData?.profileInformation}
            </h3>
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {pageData?.firstName?.title}
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={pageData?.firstName?.value}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {pageData?.lastName?.title}
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={pageData?.lastName?.value}
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    عنوان
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="e.g. California"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {pageData?.title?.title}
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={pageData?.title?.value}
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {pageData?.email?.title}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={pageData?.email?.value}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="phone-number"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {pageData?.phoneNumber?.title}
                  </label>
                  <input
                    type="number"
                    name="phone-number"
                    id="phone-number"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={pageData?.phoneNumber?.value}
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-full">
                  <Button type="primary">احفظ الكل</Button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              {pageData?.Password}
            </h3>
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="current-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {pageData?.currentPassword?.title}
                  </label>
                  <input
                    type="password"
                    name="current-password"
                    id="current-password"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={pageData?.currentPassword?.value}
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {pageData?.newPassword?.title}
                  </label>
                  <input
                    data-popover-target="popover-password"
                    data-popover-placement="bottom"
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={pageData?.newPassword?.value}
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type="text"
                    name="confirm-password"
                    id="confirm-password"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-full">
                  <Button type="primary">احفظ الكل</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSettings;
