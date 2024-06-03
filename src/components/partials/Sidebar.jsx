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
      </div>
    </aside>
  );
};

export default Sidebar;
