import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

export const Basicpiechart = ({ weeklyChart }) => {
	const [series, setSeries] = useState([]);
	const [options, setOptions] = useState({
		chart: {
			height: 300,
			type: "pie",
			events: {
				mounted: (chartContext) => {
					chartContext.windowResizeHandler();
				}
			}
		},
		colors: ["#8e54e9", "#4876e6", "#f5b849", "#49b6f5", "#e6533c"],
		labels: [],
		legend: {
			position: "left"
		},
		dataLabels: {
			dropShadow: {
				enabled: false
			}
		}
	});

	useEffect(() => {
		if (
			weeklyChart &&
			Array.isArray(weeklyChart.percentages) &&
			Array.isArray(weeklyChart.option)
		) {
			const numericPercentages = weeklyChart.percentages.map((p) => parseFloat(p));
			setSeries(numericPercentages);
	
			const combinedLabels = weeklyChart.percentages.map((percentage, index) => {
				const option = weeklyChart.option[index] || '';
				return `${percentage}% - ${option}`;
			});
	
			setOptions((prevOptions) => ({
				...prevOptions,
				labels: combinedLabels,
			}));
		}
	}, [weeklyChart]);
	

	return (
		<ReactApexChart
			options={options}
			series={series}
			type="pie"
			height={300}
		/>
	);
};
