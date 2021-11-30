/**
 * This file was generated from PieChart.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ListExpressionValue } from "mendix";
import { Big } from "big.js";

export type DataSetEnum = "static" | "dynamic";

export type AggregationTypeEnum =
    | "none"
    | "count"
    | "sum"
    | "avg"
    | "min"
    | "max"
    | "median"
    | "mode"
    | "first"
    | "last";

export type InterpolationEnum = "linear" | "spline";

export type LineStyleEnum = "line" | "lineWithMarkers" | "custom";

export interface LinesType {
    dataSet: DataSetEnum;
    staticDataSource?: ListValue;
    dynamicDataSource?: ListValue;
    groupByAttribute?: ListAttributeValue<string | boolean | Date | Big>;
    staticName?: DynamicValue<string>;
    dynamicName?: ListExpressionValue<string>;
    staticXAttribute?: ListAttributeValue<Date | Big>;
    dynamicXAttribute?: ListAttributeValue<Date | Big>;
    staticYAttribute?: ListAttributeValue<Date | Big>;
    dynamicYAttribute?: ListAttributeValue<Date | Big>;
    aggregationType: AggregationTypeEnum;
    customSeriesOptions: string;
    interpolation: InterpolationEnum;
    lineStyle: LineStyleEnum;
    lineColor?: DynamicValue<string>;
    markerColor?: DynamicValue<string>;
    onClickAction?: ActionValue;
    onClickTooltip?: ActionValue;
}

export type DeveloperModeEnum = "basic" | "advanced" | "developer";

export type WidthUnitEnum = "percentage" | "pixels";

export type HeightUnitEnum = "percentageOfWidth" | "pixels" | "percentageOfParent";

export type GridLinesEnum = "none" | "horizontal" | "vertical" | "both";

export interface LinesPreviewType {
    dataSet: DataSetEnum;
    staticDataSource: {} | { type: string } | null;
    dynamicDataSource: {} | { type: string } | null;
    groupByAttribute: string;
    staticName: string;
    dynamicName: string;
    staticXAttribute: string;
    dynamicXAttribute: string;
    staticYAttribute: string;
    dynamicYAttribute: string;
    aggregationType: AggregationTypeEnum;
    customSeriesOptions: string;
    interpolation: InterpolationEnum;
    lineStyle: LineStyleEnum;
    lineColor: string;
    markerColor: string;
    onClickAction: {} | null;
    onClickTooltip: {} | null;
}

export interface PieChartContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    lines: LinesType[];
    showLegend: boolean;
    xAxisLabel?: DynamicValue<string>;
    yAxisLabel?: DynamicValue<string>;
    developerMode: DeveloperModeEnum;
    widthUnit: WidthUnitEnum;
    width: number;
    heightUnit: HeightUnitEnum;
    height: number;
    gridLines: GridLinesEnum;
    customLayout: string;
    customConfigurations: string;
}

export interface PieChartPreviewProps {
    class: string;
    style: string;
    lines: LinesPreviewType[];
    showLegend: boolean;
    xAxisLabel: string;
    yAxisLabel: string;
    developerMode: DeveloperModeEnum;
    widthUnit: WidthUnitEnum;
    width: number | null;
    heightUnit: HeightUnitEnum;
    height: number | null;
    gridLines: GridLinesEnum;
    customLayout: string;
    customConfigurations: string;
}
