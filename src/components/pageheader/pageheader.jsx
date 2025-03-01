import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Pageheader = () => {
  // Extract the current pathname from React Router
  const { pathname } = useLocation();

  // Base path to remove from the beginning of the pathname
  const basePath = "CAFIRM";

  // Remove the base path if it exists in the current pathname
  const relativePath = pathname.startsWith(basePath) 
    ? pathname.slice(basePath.length) 
    : pathname;

  // Split the relative path into an array of route segments
  const pathSegments = relativePath.split("/").filter(Boolean);

  // Generate breadcrumb labels by capitalizing each segment
  const breadcrumbLabels = pathSegments.map(
    (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
  );

  return (
    <>
      <div className="d-sm-flex d-block align-items-center justify-content-between page-header-breadcrumb page-header-container">
        {/* Display the title as the last breadcrumb segment */}
        {/* <h4 className="fw-medium mb-0">
          {breadcrumbLabels[breadcrumbLabels.length - 1]}
        </h4> */}

        {/* <div className="ms-sm-1 ms-0">
          <nav> */}
            {/* Render breadcrumbs using Bootstrap's Breadcrumb component */}
            {/* <Breadcrumb className="breadcrumb mb-0">
              {breadcrumbLabels.map((label, index) => (
                <Breadcrumb.Item
                  key={index} */}
                  {/* active={index === breadcrumbLabels.length - 1} // Mark the last item as active */}
                  {/* href={index < breadcrumbLabels.length - 1 ? `/${pathSegments.slice(0, index + 1).join("/")}` : undefined} // Create dynamic links for non-active items */}
                {/* > */}
                  {/* {index === 0 ? label : label.toLowerCase()} Capitalize the first breadcrumb */}
                {/* </Breadcrumb.Item> */}
              {/* ))} */}
            {/* </Breadcrumb> */}
          {/* </nav> */}
        {/* </div> */}
     </div> 
    </>
  );
};

export default Pageheader;
