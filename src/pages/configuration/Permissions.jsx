import React, {
  useState,
  Fragment,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { Card, Button } from "react-bootstrap";
import Loader from "../../components/common/loader/loader";
import CustomTable from "../../components/custom/table/CustomTable";
import Search from "../../components/common/search/Search";
import { getPermissionsList } from "../../service/configuration/permissions";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const Permissions = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState([]);
  // Table column configuration (headers and accessors,editable)
  const columns = [
    { header: "S.NO", accessor: "permission_id", editable: false },
    { header: "Permission Name", accessor: "permission_name", editable: true },
    { header: "Description", accessor: "description", editable: true },
    { header: "Created On", accessor: "created_at", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];

  useEffect(() => {
    const fetchPermissionList = async () => {
      try {
        const response = await getPermissionsList();

        const permissionListData = response.data.data;
        setTableData(permissionListData);
        setFilteredData(permissionListData);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchPermissionList();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onDelete = useCallback(async (updatedData, index) => {
    setTableData((prevData) =>
      prevData.map((row, i) => (i === index ? { ...row, ...updatedData } : row))
    );

    console.log("delete class teacher mapping....", updatedData);

    try {
      const payload = {
        id: updatedData.id,
      };

      const response = await deleteClassTeacher(payload);

      if (response.data.status) {
        fetchClassTeacherData();
        Swal.fire({
          icon: "success",
          title: "Delete Teacher Mapping Successfully!",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete Teacher Mapping!",
        text:
          error.message ||
          "Something went wrong while deleting the Teacher Mapping.",
        confirmButtonText: "OK",
      });
    }
  }, []);

  const handleSaveEdit = async (editData) => {
    console.log(editData, "----editData"); // Log editData to verify it is valid
    navigate(`/addPermission/${editData.permission_id}`, { state: editData });
  };

  return (

    <Fragment>
      <Card className="custom-card p-3">
        <Card.Header className="px-0 py-0 pb-3 d-flex gap-4 justify-content-end">
          <div className="w-25"> 
          <Search 
            data={tableData}
            onSearch={(filteredResults) => setFilteredData(filteredResults)}
          />
          </div>
          
          <Button
            className="btn btn-primary"
            onClick={() => {
              navigate("/addPermission");
            }}>
            Add Permission
          </Button>
        </Card.Header>
        <Card.Body className="overflow-auto">
          <Suspense fallback={<Loader />}>
            <CustomTable
              columns={columns}
              data={filteredData}
              currentPage={currentPage}
              recordsPerPage={recordsPerPage}
              totalRecords={filteredData.length}
              handlePageChange={handlePageChange}
              onEdit={handleSaveEdit}
              editingIndex={editingIndex}
              onDelete={onDelete}
              disableOnEdit={true}
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default Permissions;
