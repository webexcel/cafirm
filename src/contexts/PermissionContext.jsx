import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUserPermissions } from "../service/configuration/permissions";

// Icons mapping
const icon1 = <i className="bx bx-desktop"></i>;
const icon6 = <i className="bx bx-error-alt"></i>;
const icon11 = <i className="bx bx-menu"></i>;

const iconMap = {
  "Master Class": icon6,
  "Dashboard": icon1,
  "Calender": icon11,
};

export const PermissionContext = createContext();

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error("usePermission must be used within a PermissionProvider");
  return context;
};

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [userData, setUserData] = useState(() => {
    const cookie = Cookies.get("user");
    return cookie ? JSON.parse(cookie) : null;
  });
  const [taskId, setTaskId] = useState([]);

  const setHandleTaskId = (id) => setTaskId(id);

  // Watch cookie for login changes
  useEffect(() => {
    const interval = setInterval(() => {
      const cookie = Cookies.get("user");
      if (cookie && JSON.stringify(JSON.parse(cookie)) !== JSON.stringify(userData)) {
        setUserData(JSON.parse(cookie));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [userData]);

  useEffect(() => {
    if (userData?.employee_id) {
      fetchPermissions();
    }
  }, [userData]);

  const fetchPermissions = async () => {
    try {
      const res = await getUserPermissions(userData?.employee_id);
      setPermissions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
    }
  };

  const getOperationFlagsById = (menuId, submenuSeq) => {
    const menu = permissions.find(m => m.parent_menu_id === menuId);
    const submenu = menu?.submenus?.find(s => s.sequence_number === submenuSeq);
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

  // Build menuItems from permissions
  useEffect(() => {
    if (!permissions.length) return;
    const items = permissions.map(parent => {
      if (parent.submenus) {
        return {
          title: parent.parent_menu,
          icon: iconMap[parent.parent_menu] || icon6,
          type: "sub",
          active: false,
          selected: false,
          dirchange: false,
          children: parent.submenus.map(sub => ({
            path: `${import.meta.env.BASE_URL}${sub.submenu.toLowerCase().replace(/[\/\s\\]/g, "")}`,
            type: "link",
            active: false,
            selected: false,
            dirchange: false,
            title: sub.submenu,
          })),
        };
      }
      return {
        path: `${import.meta.env.BASE_URL}${parent.parent_menu.toLowerCase().replace(/[\/\s\\]/g, "")}`,
        icon: iconMap[parent.parent_menu] || icon6,
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: parent.parent_menu,
      };
    });
    setMenuItems(items);
  }, [permissions]);

  return (
    <PermissionContext.Provider value={{
      permissions,
      menuItems,
      fetchPermissions,
      getOperationFlagsById,
      resetPermissions,
      taskId,
      setHandleTaskId
    }}>
      {children}
    </PermissionContext.Provider>
  );
};
