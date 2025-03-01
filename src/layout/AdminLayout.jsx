import React, { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { MENUITEMS } from "../components/common/sidebar/sidemenu";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Lazy-loaded components
const ScrollToTop = React.lazy(() => import("../components/common/scrolltop/scrolltop")); 
const Loader = React.lazy(() => import("../components/common/loader/loader"));
const Header = React.lazy(() => import("../components/common/header/header"));
const Sidebar = React.lazy(() => import("../components/common/sidebar/sidebar"));
const Switcher = React.lazy(() => import("../components/common/switcher/switcher"));
const Pageheader = React.lazy(() => import("../components/pageheader/pageheader"));
const PublicRoutes = React.lazy(() => import("../routes/PublicRoute"));

const AdminLayout = () => {
  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // State to store the current header title
  const [headerTitle, setHeaderTitle] = useState("");

  /**
   * Callback function to update the header title.
   * 
   * @param {string} title - The new title to display in the header.
   */
  const handleHeaderTitleChange = useCallback((title) => {
    setHeaderTitle(title);
    console.log('title', title);
}, [setHeaderTitle]);


  /**
   * Simulate a loading state for the component using `setTimeout`.
   * The loading state will be set to `false` after 200ms.
   */
  useEffect(() => {
    MENUITEMS.map((data) => {
      if (data?.selected) {
        console.log('dataaa admin', data.selected)
      }
      console.log('dataaa admin', data.active)

    })
    const simulateLoading = setTimeout(() => {
      setLoading(false);
    }, 200);


    return () => clearTimeout(simulateLoading); // Cleanup timeout on component unmount

  }, []);

  //Call the custom hook to set the document title to "Dashboard"
  useDocumentTitle(headerTitle);
  return (
    <>
      {loading ? (
        // Display the loader during loading state
        <Loader />
      ) : (
        // Render the main layout after loading is complete
        <>
          <ScrollToTop /> {/* This component handles scrolling to the top on route change */}
          <Switcher />
          <div className="main-page">
            {/* Header component */}
            <Header headerTitle={headerTitle} />

            {/* Page header with dynamic title */}
            <Pageheader />

            {/* Sidebar with a handler to update the header title */}
            <Sidebar onHeaderTitleChange={handleHeaderTitleChange} />

            {/* Main content area */}
            <div className="main-content app-content" style={{ marginBlockStart: '3.5rem' }}>
              <div className="container-fluid">
                <Outlet /> {/* Nested routes will be rendered here */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminLayout;
