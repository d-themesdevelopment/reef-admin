import { Collapse } from "antd";

const Sidebar = ({ role }) => {
  return (
    <aside
      id="sidebar"
      className="fixed top-0 left-0 rtl:left-auto z-20 flex flex-col flex-shrink-0 hidden w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width border-l"
      aria-label="Sidebar"
    >
      <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div
          class:list={[
            "flex flex-col flex-1 pt-5 pb-28 overflow-y-auto",
            "scrollbar scrollbar-w-2 scrollbar-thumb-rounded-[0.1667rem]",
            "scrollbar-thumb-slate-200 scrollbar-track-gray-400",
            "dark:scrollbar-thumb-slate-900 dark:scrollbar-track-gray-800",
          ]}
        >
          <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 mt-5">
            <Collapse defaultActiveKey={["1", "2", "3", "4"]}>
              {role?.indexOf("career-manager") > -1 ||
              role?.indexOf("admin") > -1 ||
              role?.indexOf("guest") > -1 ? (
                <Collapse.Panel header="Careers " key="1">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href={"/jobs"}
                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span
                          className="ml-3 rtl:ml-0 rtl:mr-3"
                          sidebar-toggle-item
                        >
                          Jobs
                        </span>
                      </a>
                    </li>

                    <li>
                      <a
                        href={"/job-requests"}
                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span
                          className="ml-3 rtl:ml-0 rtl:mr-3"
                          sidebar-toggle-item
                        >
                          Job Requests
                        </span>
                      </a>
                    </li>
                  </ul>
                </Collapse.Panel>
              ) : (
                ""
              )}

              {role?.indexOf("service-manager") > -1 ||
              role?.indexOf("admin") > -1 ||
              role?.indexOf("guest") > -1 ? (
                <Collapse.Panel header="Services" key="2">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href={"/services"}
                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span
                          className="ml-3 rtl:ml-0 rtl:mr-3"
                          sidebar-toggle-item
                        >
                          Services
                        </span>
                      </a>
                    </li>

                    <li>
                      <a
                        href={"/services-requests"}
                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span
                          className="ml-3 rtl:ml-0 rtl:mr-3"
                          sidebar-toggle-item
                        >
                          Service Requests
                        </span>
                      </a>
                    </li>
                  </ul>
                </Collapse.Panel>
              ) : (
                ""
              )}

              {role?.indexOf("hr") > -1 || role?.indexOf("admin") > -1 ? (
                <Collapse.Panel header="Users" key="3">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href={"/employees"}
                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span
                          className="ml-3 rtl:ml-0 rtl:mr-3"
                          sidebar-toggle-item
                        >
                          Employees
                        </span>
                      </a>
                    </li>

                    <li>
                      <a
                        href={"/customers"}
                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span
                          className="ml-3 rtl:ml-0 rtl:mr-3"
                          sidebar-toggle-item
                        >
                          Customers
                        </span>
                      </a>
                    </li>
                  </ul>
                </Collapse.Panel>
              ) : (
                ""
              )}

              {role?.indexOf("media-center-manager") > -1 ||
              role?.indexOf("admin") > -1 ? (
                <Collapse.Panel header="MediaCenter " key="4">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href={"/media-center"}
                        className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span
                          className="ml-3 rtl:ml-0 rtl:mr-3"
                          sidebar-toggle-item
                        >
                          Media Center
                        </span>
                      </a>
                    </li>
                  </ul>
                </Collapse.Panel>
              ) : (
                ""
              )}
            </Collapse>

            {/* <ul className="">
              <li>
                <a
                  href={"/settings"}
                  className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <span className="ml-3 rtl:ml-0 rtl:mr-3" sidebar-toggle-item>
                    Settings
                  </span>
                </a>
              </li>
            </ul> */}
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 justify-center hidden w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800"
          sidebar-bottom-menu
        >
          <a
            href="/settings/"
            data-tooltip-target="tooltip-settings"
            className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
          <div
            id="tooltip-settings"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Settings page
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
