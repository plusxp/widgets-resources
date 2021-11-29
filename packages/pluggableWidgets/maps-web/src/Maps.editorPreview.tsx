import { createElement, ReactNode } from "react";
import { MapsPreviewProps } from "../typings/MapsProps";
import { Alert } from "@mendix/piw-utils-internal/components/web";
import GoogleMapSvg from "./assets/GoogleMapsDesign.svg";
import { parseStyle } from "@mendix/piw-utils-internal";

declare function require(name: string): string;

const imagePreviewStyles = {
    backgroundImage: `url("${GoogleMapSvg}")`,
    backgroundPosition: "center, center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "375px"
};

export const preview = (props: MapsPreviewProps): ReactNode => {
    return (
        <div className={props.className} style={parseStyle(props.style)}>
            {(props.mapProvider === "mapBox" || props.mapProvider === "hereMaps") && (
                <Alert bootstrapStyle="warning">
                    Provider unavailable without API Key, preview is not possible at the moment
                </Alert>
            )}
            <div style={imagePreviewStyles} />
        </div>
    );
};

export function getPreviewCss(): string {
    return require("leaflet/dist/leaflet.css") + require("./ui/Maps.css") + require("./ui/GoogleMapsPreview.css");
}
