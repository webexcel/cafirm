import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserPermissions } from "../service/configuration/permissions";

const icon1 = <i className="bx bx-desktop"></i>;
const icon6 = <i className="bx bx-error-alt"></i>;
const icon11 = <i className="bx bx-menu"></i>;

const iconMap = {
  "Master Class": icon6,
  "Dashboard": icon1,
  "Calender": icon11,
};

export const PermissionContext = createContext(undefined);

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [userData, setUserData] = useState(() => {
    const storedData = Cookies.get("user");
    return storedData ? JSON.parse(storedData) : null;
  });

  const fetchPermissions = async () => {
    try {
      const response = await getUserPermissions(userData?.employee_id);
      console.log("Fetched Permissions:", response.data.data);
      setPermissions(response.data.data);
    } catch (err) {
      console.error("Failed to fetch permissions:", err.message);
    }
  };

  const getOperationFlagsById = (menuId, submenuSeq) => {
    const menu = permissions.find((menu) => menu.parent_menu_id === menuId);
    const submenu = menu?.submenus?.find((sub) => sub.sequence_number === submenuSeq);

    return submenu
      ? submenu.operations.reduce((acc, { operation }) => {
          acc[`show${operation}`] = true;
          return acc;
        }, {})
      : {};
  };

  const resetPermissions = () => {
    setPermissions([]);
    setMenuItems([]);
  };

  useEffect(() => {
    if (!permissions.length) return;

    const menuData = permissions.map((parent) => {
      if (parent.submenus) {
        return {
          title: parent.parent_menu,
          icon: iconMap[parent.parent_menu] || icon6,
          type: "sub",
          active: false,
          selected: false,
          dirchange: false,
          children: parent.submenus.map((submenu) => ({
            path: `${import.meta.env.BASE_URL}${submenu.submenu.replace(/[\s/]+/g, "")}`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: submenu.submenu,
          })),
        };
      } else {
        return {
          path: `${import.meta.env.BASE_URL}${parent.parent_menu.replace(/[\s/]+/g, "")}`,
          icon: iconMap[parent.parent_menu] || icon6,
          type: "link",
          active: false,
          selected: false,
          dirchange: false,
          title: parent.parent_menu,
        };
      }
    });

    setMenuItems(menuData);
  }, [permissions]);

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        menuItems,
        fetchPermissions,
        getOperationFlagsById,
        resetPermissions
      }}>
      {children}
    </PermissionContext.Provider>
  );
};