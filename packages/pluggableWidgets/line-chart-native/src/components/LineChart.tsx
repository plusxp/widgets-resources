import { createElement, ReactElement, useMemo } from "react";
import { InterpolationPropType } from "victory-core";
import { VictoryChart, VictoryLine, VictoryGroup, VictoryScatter, VictoryAxis, VictoryLabel } from "victory-native";

import { LineChartStyle } from "../ui/Styles";

export interface LineChartProps {
    series: Array<LineChartSeries>;
    style: LineChartStyle;
}

export interface LineChartSeries {
    id: number;
    dataPoints: Array<LineChartDataPoint>;
    showMarkers: "false" | "underneath" | "onTop";
    interpolation: InterpolationPropType;
    stylePropertyName: string;
}

export interface LineChartDataPoint {
    x: number;
    y: number;
}

export function LineChart(props: LineChartProps): ReactElement | null {
    if (props.series.length === 0) {
        return null;
    }

    const chartLines = useMemo(
        () =>
            props.series.map(series => {
                const seriesStyle = props.style.series ? props.style.series[series.stylePropertyName] : undefined;

                const markers = (
                    <VictoryScatter
                        data={series.dataPoints}
                        style={seriesStyle?.markers}
                        size={seriesStyle?.markers?.size}
                    />
                );

                return (
                    <VictoryGroup key={series.id}>
                        {series.showMarkers === "underneath" ? markers : null}
                        <VictoryLine
                            style={seriesStyle?.line}
                            data={series.dataPoints}
                            interpolation={series.interpolation}
                        />
                        {series.showMarkers === "onTop" ? markers : null}
                    </VictoryGroup>
                );
            }),
        [props.series, props.style]
    );

    return (
        <VictoryChart padding={props.style.chart?.padding}>
            <VictoryAxis
                style={props.style.xAxis}
                axisLabelComponent={<VictoryLabel dy={props.style.xAxis?.axisLabel?.verticalOffset} />}
                label={"Quarters 2019"}
            />
            <VictoryAxis
                dependentAxis
                style={props.style.yAxis}
                axisLabelComponent={<VictoryLabel dy={props.style.yAxis?.axisLabel?.horizontalOffset} />}
                label={"Profit (€)"}
            />
            {chartLines}
        </VictoryChart>
    );
}