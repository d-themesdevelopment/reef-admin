import { useEffect, useState } from "react";
import qs from "qs";
import { Button, Modal, Select, Switch } from "antd";
import UserModal from "../features/modals/UserModal";
import UserEditModal from "../features/modals/UserEditModal";
import Loading from "../common/Loading";
import { toast } from "react-toastify";
import { EditOutlined } from "@ant-design/icons";

const urlParamsObject = {
  populate: {
    role: {
      populate: "*",
    },
    avatar: {
      populate: "*",
    },
    background: {
      populate: "*",
    },
    brand: {
      populate: "*",
    },
    serviceOrderRequestIDs: {
      populate: "*",
    },
    attachedFile: {
      populate: "*",
    },
    employee_roles: {
      populate: "*",
    },
  },
};

const Employees = ({ role, apiUrl, apiToken, employeeRoles }) => {
  const [users, setUsers] = useState();
  const [roles, setRoles] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openUserEdit, setOpenUserEdit] = useState(false);
  const [openUserDelete, setOpenUserDelete] = useState(false);
  const [openApproved, setOpenApproved] = useState(false);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const getUsers = async () => {
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${apiUrl}/api/users?${queryString}`;

    try {
      const response = await fetch(requestUrl);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users-permissions/roles`);
      const data = await response.json();
      setRoles(data?.roles);
    } catch (error) {
      console.error(error);
    }
  };

  const clearAllData = () => {
    setOpenAddUserModal(false);
  };

  const handleSendEmail = async () => {
    const identifier = selectedUser?.email;
    const username = selectedUser?.username;

    await fetch(`${apiUrl}/api/auth/send-email`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `bearer ${apiToken}`,
      },
      body: JSON.stringify({
        identifier,
        username,
      }),
    });
  };

  const handleApproveEmployee = async () => {
    setLoading(true);
    const data = { approvedAsEmployee: !selectedUser?.approvedAsEmployee };

    try {
      const req = await fetch(`${apiUrl}/api/users/${selectedUser?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (req.ok) {
        getUsers();

        if (!selectedUser.approvedAsEmployee) {
          handleSendEmail();

          toast.success("👌 Successfully Approve", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        } else {
          toast.success("👌 Successfully Disabled", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }

        setTimeout(() => {
          setLoading(false);
          setOpenApproved(false);
        }, 1500);
      } else {
        toast.error("Approve failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          setLoading(false);
          setOpenApproved(false);
        }, 1500);
      }
    } catch (error) {
      console.error(error);

      toast.error("Approve failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setTimeout(() => {
        setLoading(false);
        setOpenApproved(false);
      }, 1500);
    }
  };

  const handleDeleteUser = async (user) => {
    setLoading(true);

    const response = await fetch(`${apiUrl}/api/users/${user?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`, // Replace with your Strapi JWT token
      },
    });

    if (response.ok) {
      getUsers();

      setTimeout(() => {
        setLoading(false);
        setOpenUserDelete(false);
      }, 1500);

      toast.success("👌 User deleted successfully!", {
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
      console.error("Error deleting user");
      setTimeout(() => {
        setLoading(false);
        setOpenUserDelete(false);
      }, 1500);

      toast.error("Error deleting user!", {
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

  const [selectedItems, setSelectedItems] = useState([]);
  const [roleEdit, setRoleEdit] = useState(false);

  const handleMain = async () => {
    setLoading(true);

    let data = {};

    if (!roleEdit) {
      data = {
        ...data,
        approvedEmployeeRole: !selectedUser?.approvedEmployeeRole,
      };
    }

    if (openAdmin) {
      data = { ...data, isAdmin: true };
    } else {
      data = { ...data, isAdmin: false };
    }

    if (selectedItems.length > 0) {
      data = {
        ...data,
        employee_roles: employeeRoles?.filter((role) =>
          selectedItems?.find((item) => item === role?.attributes?.value)
        ),
      };
    }

    try {
      const req = await fetch(`${apiUrl}/api/users/${selectedUser?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // set the auth token to the user's jwt
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (req.ok) {
        getUsers();

        const res = await req.json();

        if (res?.approvedEmployeeRole) {
          if (!roleEdit) {
            handleSendEmail();
          }

          toast.success(
            `${
              roleEdit ? "👌 Successfully Updated" : "👌 Successfully Approve"
            }`,
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
        } else {
          toast.success("👌 Successfully Disabled", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }

        setTimeout(() => {
          setLoading(false);
          setRoleEdit(false);
          setOpenEmployee(false);
          setOpenAdmin(false);
          setSelectedItems([]);
        }, 1500);
      } else {
        toast.error(`${roleEdit ? "Update failed" : "Approve failed"}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          setLoading(false);
          setRoleEdit(false);
          setOpenEmployee(false);
          setOpenAdmin(false);
          setSelectedItems([]);
        }, 1500);
      }
    } catch (error) {
      console.error(error);

      toast.error("Error", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setTimeout(() => {
        setLoading(false);
        setRoleEdit(false);
        setOpenEmployee(false);
        setOpenAdmin(false);
        setSelectedItems([]);
      }, 1500);
    }
  };

  const handleUpdateEmployeeRoles = async () => {
    if (selectedItems?.find((item) => item === "admin")) {
      setOpenAdmin(true);
    } else {
      handleMain();
    }
  };

  return (
    <>
      {loading && <Loading />}

      <div className="block overflow-hidden shadow">
        <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
          <div className="w-full mb-1">
            <div className="mb-4">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                All Employees
              </h1>
            </div>

            <div className="sm:flex">
              <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
                <form className="lg:pr-3" action="#" method="GET">
                  <label htmlFor="users-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative mt-1 lg:w-64 xl:w-96">
                    <input
                      type="text"
                      name="email"
                      id="users-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search for users"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center rtl:ml-0 rtl:mr-auto ml-auto space-x-2 sm:space-x-3">
                {role?.indexOf("guest") < 0 && (
                  <Button
                    type="primary"
                    onClick={() => setOpenAddUserModal(true)}
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
                    Add user
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow">
                <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        UserName
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Mobile Number
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Company Name
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Address
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        Roles
                      </th>
                      <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                        User Status
                      </th>
                      {role?.indexOf("admin") > -1 && (
                        <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                          Role Status
                        </th>
                      )}

                      {role?.indexOf("guest") < 0 && (
                        <th className="p-4 text-xs font-medium text-left rtl:text-right text-gray-500 uppercase dark:text-gray-400">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {users
                      ?.filter((item) => item.isEmployee)
                      ?.sort((a, b) => b.id - a.id)
                      .map((user, index) => (
                        <tr
                          className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          key={index}
                        >
                          <td className="flex items-center p-4 mr-12 rtl:mr-0 rtl:ml-0 whitespace-nowrap">
                            {user?.avatar ? (
                              <img
                                className="w-10 h-10 rounded-full rtl:ml-6"
                                src={user?.avatar?.url}
                                alt={`avatar`}
                              />
                            ) : (
                              <div className="flex items-center justify-center font-semibold text-xl w-10 h-10 rounded-full rtl:ml-6 bg-gray-200">
                                {user?.username?.charAt(0)}
                              </div>
                            )}

                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                              <div className="text-base font-semibold text-gray-900 dark:text-white">
                                {user?.username}
                              </div>
                              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                {user?.email}
                              </div>
                            </div>
                          </td>

                          <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {user?.mobileNumber}
                          </td>

                          <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {user?.companyName}
                          </td>

                          <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            {user?.address}
                          </td>

                          <td className="max-w-sm p-4  font-semibold overflow-hidden text-base text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                            <div className="flex flex-wrap">
                              {user?.approvedEmployeeRole && (
                                <button
                                  title="Edit"
                                  className="hover:text-primary"
                                  onClick={() => {
                                    setOpenEmployee(true);
                                    setSelectedUser(user);
                                    setRoleEdit(true);
                                  }}
                                >
                                  <EditOutlined className="ml-2" />
                                </button>
                              )}

                              {user?.employee_roles?.length > 0
                                ? user?.employee_roles?.map(
                                    (userRole, index) => (
                                      <button
                                        className={`ml-2 mb-2  px-2 py-2 rounded-lg text-xs ${
                                          user?.approvedEmployeeRole
                                            ? "bg-primary text-white"
                                            : "bg-gray-300"
                                        }`}
                                        key={index}
                                      >
                                        {userRole?.title}
                                      </button>
                                    )
                                  )
                                : "Guest"}
                            </div>
                          </td>

                          <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                            <div className="flex items-center">
                              {role?.indexOf("guest") < 0 && (
                                <Switch
                                  checked={user?.approvedAsEmployee}
                                  onChange={() => {
                                    setOpenApproved(true);
                                    setSelectedUser(user);
                                  }}
                                />
                              )}

                              <span
                                className={` mr-3 ${
                                  user?.approvedAsEmployee
                                    ? "font-semibold"
                                    : "text-gray-500"
                                }`}
                              >
                                {user?.approvedAsEmployee
                                  ? "Approved"
                                  : "Not Approved"}
                              </span>
                            </div>
                          </td>

                          {role?.indexOf("admin") > -1 && (
                            <td className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="flex items-center">
                                <>
                                  <Switch
                                    checked={
                                      user?.approvedEmployeeRole || false
                                    }
                                    onChange={() => {
                                      setOpenEmployee(true);
                                      setSelectedUser(user);
                                    }}
                                  />

                                  <span
                                    className={` mr-3 ${
                                      user?.approvedEmployeeRole
                                        ? "font-semibold"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {user?.approvedEmployeeRole
                                      ? "Approved"
                                      : "Not Approved"}
                                  </span>
                                </>
                              </div>
                            </td>
                          )}
                          {role?.indexOf("guest") < 0 && (
                            <td className="p-4 space-x-2 whitespace-nowrap">
                              <Button
                                type="primary"
                                onClick={() => {
                                  setOpenUserEdit(true);
                                  setSelectedUser(user);
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
                                Edit user
                              </Button>
                              <Button
                                onClick={() => {
                                  setOpenUserDelete(true);
                                  setSelectedUser(user);
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
                                Delete user
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
      </div>

      <Modal
        centered
        open={openAddUserModal}
        onCancel={() => {
          clearAllData();
        }}
        width={500}
        footer={null}
      >
        <UserModal
          roles={roles}
          apiUrl={apiUrl}
          setLoading={setLoading}
          apiToken={apiToken}
          setOpenAddUserModal={setOpenAddUserModal}
          employeeRoles={employeeRoles}
        />
      </Modal>

      <Modal
        centered
        open={openUserEdit}
        onCancel={() => {
          setOpenUserEdit(false);
        }}
        width={500}
        footer={null}
      >
        <UserEditModal
          users={users}
          setUsers={setUsers}
          selectedUser={selectedUser}
          setLoading={setLoading}
          roles={roles}
          apiUrl={apiUrl}
          apiToken={apiToken}
          setOpenUserEdit={setOpenUserEdit}
        />
      </Modal>

      <Modal
        centered
        open={openUserDelete}
        onCancel={() => {
          setOpenUserDelete(false);
        }}
        width={300}
        footer={null}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center">Are u sure?</h3>

        <div className="flex items-center justify-center">
          <Button type="primary" onClick={() => handleDeleteUser(selectedUser)}>
            OK
          </Button>
          <Button className="mr-2" onClick={() => setOpenUserDelete(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal
        centered
        open={openEmployee}
        onCancel={() => {
          setOpenEmployee(false);
          setSelectedItems([]);
        }}
        width={400}
        footer={null}
      >
        {roleEdit ? (
          <>
            <h3 className="text-2xl font-semibold mb-6 text-center">
              {" "}
              Are u going to change the employee role?
            </h3>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-6 text-center">
              {" "}
              Are u going to{" "}
              {selectedUser?.approvedEmployeeRole
                ? "be disable"
                : "approve"}{" "}
              this employee's role?
            </h3>

            <h4 className="text-center text-lg mb-2">You can edit his roles</h4>
          </>
        )}

        <Select
          mode="multiple"
          placeholder="Inserted are removed"
          value={
            selectedItems.length > 0
              ? selectedItems
              : selectedUser?.employee_roles.map((item) => item?.value)
          }
          onChange={setSelectedItems}
          style={{
            width: "100%",
          }}
          options={employeeRoles?.map((item) => ({
            value: item?.attributes?.value,
            label: item?.attributes?.title,
          }))}
        />

        <div className="flex items-center justify-center mt-5">
          <Button type="primary" onClick={() => handleUpdateEmployeeRoles()}>
            OK
          </Button>

          <Button
            className="mr-2"
            onClick={() => {
              setOpenEmployee(false);
              setSelectedItems([]);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal
        centered
        open={openApproved}
        onCancel={() => {
          setOpenApproved(false);
        }}
        width={300}
        footer={null}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center">
          Are u going to{" "}
          {selectedUser?.approvedAsEmployee ? "be disable" : "approve"} this
          user?
        </h3>

        <div className="flex items-center justify-center">
          <Button
            type="primary"
            onClick={() => handleApproveEmployee(selectedUser)}
          >
            OK
          </Button>
          <Button className="mr-2" onClick={() => setOpenApproved(false)}>
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal
        centered
        open={openAdmin}
        onCancel={() => {
          setOpenAdmin(false);
        }}
        width={500}
        footer={null}
      >
        <div className="modal-wrap py-5">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Are you really going to assign this employee as Admin?
          </h3>

          <div className="flex items-center justify-center">
            <Button
              type="primary"
              onClick={() => {
                handleMain();
              }}
            >
              OK
            </Button>
            <Button className="mr-2" onClick={() => setOpenAdmin(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Employees;
