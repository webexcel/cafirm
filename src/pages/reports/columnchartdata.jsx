import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export const Distributed = ({ monthlyChart }) => {
	const [options, setOptions] = useState({
		chart: {
			height: 320,
			type: "bar",
			events: {
				click: function (_chart, _w, _e) { },
				mounted: (chart) => {
					chart.windowResizeHandler();
				}
			}
		},
		colors: ["#8e54e9", "#4876e6", "#f5b849", "#49b6f5", "#e6533c", "#26bf94", "#5b67c7", "#a65e76"],
		plotOptions: {
			bar: {
				columnWidth: "45%",
				distributed: true,
			}
		},
		dataLabels: {
			enabled: false
		},
		legend: {
			show: false
		},
		grid: {
			borderColor: "#f2f5f7"
		},
		xaxis: {
			categories: [],
			labels: {
				style: {
					colors: ["#8c9097"],
					fontSize: "12px"
				}
			}
		},
		yaxis: {
			labels: {
			  show: true,
			  formatter: (value) => `${value} hrs`,
			  style: {
				colors: "#8c9097",
				fontSize: "11px",
				fontWeight: 600,
				cssClass: "apexcharts-yaxis-label",
			  }
			}
		  },
		title: {
			// text: "",
			align: "left",
			style: {
				fontSize: "14px",
				fontWeight: "bold",
				color: "#8c9097"
			}
		}
	});

	const [series, setSeries] = useState([{ data: [] }]);

	useEffect(() => {
		setOptions((prevOptions) => ({
			...prevOptions,
			xaxis: {
				...prevOptions.xaxis,
				categories: monthlyChart.task
			}
		}));

		setSeries([{ data: monthlyChart.time.map((val) => Number(val)) }]);
	}, [monthlyChart]);

	return (
		<ReactApexChart options={options} series={series} type="bar" height={350} />
	);
};
