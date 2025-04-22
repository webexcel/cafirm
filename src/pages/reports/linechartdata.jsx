import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

export const Basicline = ({ title, chartData }) => {
	const [options, setOptions] = useState({
		chart: {
			height: 320,
			type: "line",
			zoom: { enabled: false },
			events: {
				mounted: (chartContext) => {
					chartContext.windowResizeHandler();
				}
			}
		},
		colors: ["#8e54e9"],
		dataLabels: { enabled: false },
		stroke: { curve: "straight", width: 3 },
		grid: { borderColor: "#f2f5f7" },
		title: {
			text: title,
			align: "left",
			style: {
				fontSize: "13px",
				fontWeight: "bold",
				color: "#8c9097"
			}
		},
		xaxis: {
			categories: [],
			labels: {
				show: true,
				style: {
					colors: "#8c9097",
					fontSize: "11px",
					fontWeight: 600,
					cssClass: "apexcharts-xaxis-label"
				}
			}
		},
		yaxis: {
			labels: {
				show: true,
				style: {
					colors: "#8c9097",
					fontSize: "11px",
					fontWeight: 600,
					cssClass: "apexcharts-yaxis-label"
				}
			},
			forceNiceScale: true
		}
	});

	const [series, setSeries] = useState([]);

	// 🧠 Update chart config when chartData changes
	useEffect(() => {
		setOptions((prevOptions) => ({
			...prevOptions,
			title: { ...prevOptions.title, text: title },
			xaxis: {
				...prevOptions.xaxis,
				categories: chartData.months || []
			}
		}));

		setSeries([
			{
				name: "Task Count",
				data: chartData.monthData || []
			}
		]);
	}, [chartData, title]);

	return (
		<ReactApexChart options={options} series={series} type="line" height={300} />
	);
};
