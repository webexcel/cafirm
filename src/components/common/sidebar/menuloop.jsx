import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Menuloop({ MENUITEMS, toggleSidemenu, level, onHeaderTitleChange, MENUFULLITMS }) {
  const [menuState, setMenuState] = useState(MENUITEMS);

//   useEffect(() => {
//     getHeaderTitle();
//   }, []);

//   async function getHeaderTitle() {
// 	console.log("MENUITEMS",MENUITEMS)
//     MENUFULLITMS.map(async (data) => {
//       if (data.active) {
//         if (data.children) {
//           data.children.map(async (child) => {
//             if (child.active) {
//               await onHeaderTitleChange(child.title);
//             }
//           });
//         } else {
//           await onHeaderTitleChange(data.title);
//         }
//       }
//     });

//     if (MENUITEMS.active && MENUITEMS.children) {
//       MENUITEMS.children.map(async (child) => {
//         if (child.selected) {
//           await onHeaderTitleChange(child.title);
//         }
//       });
//     }
//   }

  function handleToggleMenu(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from bubbling up
     console.log("event",event,menuState)
    // Toggle submenu only when clicking the parent
    setMenuState((prev) => ({ ...prev, active: !prev.active }));
  }

  return (
    <Fragment>
      {/* Main Menu Item */}
      <Link
        to="#"
        className={`side-menu__item ${menuState.selected ? "active" : ""}`}
        onClick={handleToggleMenu}
      >
        {/* Show Icon Only at Level 1 or Below */}
        {level <= 1 && <span className="side-menu__icon">{menuState.icon}</span>}

        {/* Show Menu Title */}
        <span className={`${level === 1 ? "side-menu__label" : ""}`}>
          {menuState.title}
          {menuState.badgetxt && <span className={menuState.class}>{menuState.badgetxt}</span>}
        </span>

        {/* Toggle Submenu on Arrow Click */}
        {menuState.children && menuState.children.length > 0 && (
          <i
            className={`fe fe-chevron-right side-menu__angle ${menuState.active ? "rotated" : ""}`}
            onClick={handleToggleMenu}
          ></i>
        )}
      </Link>

      {/* Submenu Container */}
      {menuState.children && (
        <ul
          className={`slide-menu child${level} ${menuState.active ? "double-menu-active" : ""} ${
            menuState.dirchange ? "force-left" : ""
          }`}
          style={{ display: menuState.active ? "block" : "none" }}
          onClick={(event) => event.stopPropagation()} // Keep submenu open when clicking inside
        >
          {/* Category Label for Top-Level Menus */}
          {level <= 1 && (
            <li className="slide side-menu__label1">
              <Link to="#">{menuState.title}</Link>
            </li>
          )}

          {/* Render Child Menu Items */}
          {menuState.children.map((child) => (
            <li
              key={child.path}
              className={`${child.menutitle ? "slide__category" : ""} ${
                child.type === "empty" ? "slide" : ""
              } ${child.type === "link" ? "slide" : ""} ${child.type === "sub" ? "slide has-sub" : ""} ${
                child.active ? "open" : ""
              } ${child.selected ? "active" : ""}`}
            >
              {/* Render Link Type */}
              {child.type === "link" && (
                <Link to={child.path} className={`side-menu__item ${child.selected ? "active" : ""}`}>
                  {child.icon}
                  <span>
                    {child.title}
                    {child.badgetxt && <span className={child.class}>{child.badgetxt}</span>}
                  </span>
                </Link>
              )}

              {/* Render Empty Type */}
              {child.type === "empty" && (
                <Link to="#" className="side-menu__item">
                  <span>
                    {child.title}
                    {child.badgetxt && <span className={child.class}>{child.badgetxt}</span>}
                  </span>
                </Link>
              )}

              {/* Recursively Render Submenus */}
              {child.type === "sub" && (
                <Menuloop
                  MENUITEMS={child}
                  toggleSidemenu={toggleSidemenu}
                  level={level + 1}
                  onHeaderTitleChange={onHeaderTitleChange}
                  MENUFULLITMS={MENUFULLITMS}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default React.memo(Menuloop);
