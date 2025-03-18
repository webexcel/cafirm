//Icons

const icon1 = <i className="bx bx-desktop"></i>;
const icon6 = <i className="bx bx-error-alt"></i>;
const icon11 = <i className="bx bx-menu"></i>;

//Badges
const badge1 = <span className="badge bg-warning-transparent ms-2 d-inline-block">12</span>;
export const MENUITEMS = [

	{
		menutitle: "CA FIRM",
	},

	// Dashboard 
	{ path: `${import.meta.env.BASE_URL}dashboard`, icon: icon1, type: "link", active: false, selected: false, dirchange: false, title: "Dashboard" },


	// Dashboard 
	{ path: `${import.meta.env.BASE_URL}calender`, icon: icon1, type: "link", active: false, selected: false, dirchange: false, title: "Calender" },


	//Configuration	
	// {
	// 	title: "Configuration", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
	// 	children: [
	// 	],
	// },

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
			{ path: `${import.meta.env.BASE_URL}addManageClient`, type: "link", active: false, selected: false, dirchange: false, title: "Create Clients" },
			{ path: `${import.meta.env.BASE_URL}viewEditClient`, type: "link", active: false, selected: false, dirchange: false, title: "View / Edit Profile" },
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
		title: "TimeSheet", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}addTimeSheet`, type: "link", active: false, selected: false, dirchange: false, title: "Create Task" },
			{ path: `${import.meta.env.BASE_URL}viewtask`, type: "link", active: false, selected: false, dirchange: false, title: "View Task" },
			{ path: `${import.meta.env.BASE_URL}timeSheet`, type: "link", active: false, selected: false, dirchange: false, title: "Add Timesheet" },
			{ path: `${import.meta.env.BASE_URL}clientTimeSheet`, type: "link", active: false, selected: false, dirchange: false, title: "View Timesheet" },
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
		title: "Master Class", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}createService`, type: "link", active: false, selected: false, dirchange: false, title: "Create Service" },
		],
	},

	//Configuration
	{
		title: "Configuration", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}permissions`, type: "link", active: false, selected: false, dirchange: false, title: "Permissions" },
		],
	},

	//Attendance
	{
		title: "Attendance", icon: icon6, type: "sub", active: false, selected: false, dirchange: false,
		children: [
			{ path: `${import.meta.env.BASE_URL}activityTracker`, type: "link", active: false, selected: false, dirchange: false, title: "Add Attendance" },
			{ path: `${import.meta.env.BASE_URL}workTimeSheet`, type: "link", active: false, selected: false, dirchange: false, title: "View Attendance" },
		],
	},
];
