//Icons

const icon1 = <i className="bx bx-desktop"></i>;
const icon6 = <i className="bx bx-error-alt"></i>;
const icon11 = <i className="bx bx-menu"></i>;

//Badges
const badge1 = <span className="badge bg-warning-transparent ms-2 d-inline-block">12</span>;
export const MENUITEMS = [

	// Dashboard 
	{ path: `${import.meta.env.BASE_URL}dashboard`, icon: icon1, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },


	// Dashboard 
	{ path: `${import.meta.env.BASE_URL}calender`, icon: icon1, type: "link", active: false, selected: false, dirchange: false, title: "Calender" },



	//Client Management	
	{
		title: "Employee Management", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}createEmployee`, type: "link", active: false, selected: false, dirchange: false, title: "Create Employee" },
			{ path: `${import.meta.env.BASE_URL}vieweditprofile`, type: "link", active: false, selected: false, dirchange: false, title: "View / Edit Profile" },
			{ path: `${import.meta.env.BASE_URL}createuseraccount`, type: "link", active: false, selected: false, dirchange: false, title: "Create User Account" },
		],
	},

	//Client Management	
	{
		title: "Client Management", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}CreateClients`, type: "link", active: false, selected: false, dirchange: false, title: "Create Clients" },
			{ path: `${import.meta.env.BASE_URL}ViewEditProfiles`, type: "link", active: false, selected: false, dirchange: false, title: "View / Edit Profile" },
			// { path: `${import.meta.env.BASE_URL}addService`, type: "link", active: false, selected: false, dirchange: false, title: "Add Service" },
			// { path: `${import.meta.env.BASE_URL}addManageClient`, type: "link", active: false, selected: false, dirchange: false, title: "View / Edit Service" },
		],
	},

	//Task Management.
	// {
	// 	title: "Tasks", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
	// 	children: [
	// 		{ path: `${import.meta.env.BASE_URL}taskTracking`, type: "link", active: false, selected: false, dirchange: false, title: "Create Tasks" },
	// 	],
	// },

	//Employee Time Tracking

	{
		title: "Task", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}CreateTask`, type: "link", active: false, selected: false, dirchange: false, title: "Create Task" },
			{ path: `${import.meta.env.BASE_URL}viewtask`, type: "link", active: false, selected: false, dirchange: false, title: "View Task" },
		],
	},
	{
		title: "TimeSheet", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}AddTimesheet`, type: "link", active: false, selected: false, dirchange: false, title: "Add Timesheet" },
			{ path: `${import.meta.env.BASE_URL}viewTimeSheet`, type: "link", active: false, selected: false, dirchange: false, title: "View Timesheet" },
			{ path: `${import.meta.env.BASE_URL}weeklyTimeSheet`, type: "link", active: false, selected: false, dirchange: false, title: "Weekly Timesheet" },
		],
	},
	//Reporting
	// {
	// 	title: "Reports", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
	// 	children: [
	// 	],
	// },

	// //Invoicing
	// { path: `${import.meta.env.BASE_URL}invoice`, icon: icon1, type: "link", active: false, selected: false, dirchange: false, title: "Invoice" },


	//Master Details
	{
		title: "Master Details", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [

			{ path: `${import.meta.env.BASE_URL}Roles`, type: "link", active: false, selected: false, dirchange: false, title: "Roles" },
			{ path: `${import.meta.env.BASE_URL}createService`, type: "link", active: false, selected: false, dirchange: false, title: "Create Service" },
			{ path: `${import.meta.env.BASE_URL}createDocType`, type: "link", active: false, selected: false, dirchange: false, title: "Create Document Type" },

		],
	},

	//Master Details
	{
		title: "Reports", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [

			// { path: `${import.meta.env.BASE_URL}EmployeeReports`, type: "link", active: false, selected: false, dirchange: false, title: "Employee Report" },
			{ path: `${import.meta.env.BASE_URL}EmployeeDateWiseReport`, type: "link", active: false, selected: false, dirchange: false, title: "Employee DateWise Report" },
			{ path: `${import.meta.env.BASE_URL}ClientDateWiseReport`, type: "link", active: false, selected: false, dirchange: false, title: "Client DateWise Report" },
			// { path: `${import.meta.env.BASE_URL}EmployeeWeeklyReports`, type: "link", active: false, selected: false, dirchange: false, title: "Employee Weekly Report" },
			// { path: `${import.meta.env.BASE_URL}EmployeeMonthlyReports`, type: "link", active: false, selected: false, dirchange: false, title: "Employee Monthly Report" },
			// { path: `${import.meta.env.BASE_URL}EmployeeYearlyReports`, type: "link", active: false, selected: false, dirchange: false, title: "Employee Annual Report" },
			// { path: `${import.meta.env.BASE_URL}ClientWeeklyReports`, type: "link", active: false, selected: false, dirchange: false, title: "Client Weekly Report" },
			// { path: `${import.meta.env.BASE_URL}ClientMonthlyReports`, type: "link", active: false, selected: false, dirchange: false, title: "Client Monthly Report" },
			// { path: `${import.meta.env.BASE_URL}ClientYearlyReports`, type: "link", active: false, selected: false, dirchange: false, title: "Client Annual Report" },
		],
	},

	//Configuration
	{
		title: "Configuration", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			// { path: `${import.meta.env.BASE_URL}assignUser`, type: "link", active: false, selected: false, dirchange: false, title: "Assign User" },
			{ path: `${import.meta.env.BASE_URL}AddMenu`, type: "link", active: false, selected: false, dirchange: false, title: "Add Menu" },
			{ path: `${import.meta.env.BASE_URL}addOperations`, type: "link", active: false, selected: false, dirchange: false, title: "Operation" },

		],
	},

	//Attendance
	{
		title: "Attendance Management", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}addAttendance`, type: "link", active: false, selected: false, dirchange: false, title: "Add Attendance" },
			{ path: `${import.meta.env.BASE_URL}viewAttendance`, type: "link", active: false, selected: false, dirchange: false, title: "View Attendance" },
		],
	},
	// Documents 
	{ path: `${import.meta.env.BASE_URL}documentation`, icon: icon1, type: "link", active: false, selected: false, dirchange: false, title: "Document Management" },


	//Billing
	// {
	// 	title: "Billing & Invoicing", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
	// 	children: [
	// 		 { path: `${import.meta.env.BASE_URL}createService`, type: "link", active: false, selected: false, dirchange: false, title: "Generate invoices" },
	// 		 { path: `${import.meta.env.BASE_URL}createService`, type: "link", active: false, selected: false, dirchange: false, title: "Track Payment Status" },
	// 	],
	// },

	//Documents
	// {
	// 	title: "Document Management", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
	// 	children: [
	// 		 { path: `${import.meta.env.BASE_URL}createService`, type: "link", active: false, selected: false, dirchange: false, title: "Upload Documents" },
	// 		 { path: `${import.meta.env.BASE_URL}createService`, type: "link", active: false, selected: false, dirchange: false, title: "Manage Documents" },
	// 	],
	// },
];
