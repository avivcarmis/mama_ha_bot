import {writeFile} from "fs";
const chartExporter = require("highcharts-export-server");

type PieChartEntry = {
    name: string;
    y: number;
};

export async function generatePieChart(title: string, data: PieChartEntry[], filename: string): Promise<undefined> {
    chartExporter.initPool();
    const chartDetails = {
        type: "png",
        options: {
            chart: {type: "pie"},
            title: {text: title},
            series: [{data}],
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.y}"
                    }
                }
            }
        }
    };
    return new Promise((resolve, reject) => {
        chartExporter.export(chartDetails, (err: any, res: any) => {
            writeFile(filename, res.data, "base64", (err) => {
                if (err) {
                    reject();
                } else {
                    chartExporter.killPool();
                    resolve();
                }
            });
        });
    });
}
