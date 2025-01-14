import { createElement, ReactElement } from "react";
import { Rating as RatingComponent } from "./components/Rating";
import { parseStyle } from "@mendix/piw-utils-internal";
import { mapPreviewIconToWebIcon } from "@mendix/piw-utils-internal/components/web";
import { StarRatingPreviewProps } from "../typings/StarRatingProps";
import { Icon } from "./components/Icon";

// TODO: The widget generator is out of sync with Studio Pro design mode. Change PIW preview props typing (class -> className) and readOnly generation when updated.
interface PreviewProps extends Omit<StarRatingPreviewProps, "class"> {
    className: string;
    readOnly?: boolean;
}

export function preview(props: PreviewProps): ReactElement {
    const { className, readOnly } = props;

    const emptyIcon = props.emptyIcon ? (
        <Icon value={mapPreviewIconToWebIcon(props.emptyIcon)} empty />
    ) : (
        <Icon value={{ type: "glyph", iconClass: "glyphicon-star-empty" }} empty />
    );
    const fullIcon = props.icon ? (
        <Icon value={mapPreviewIconToWebIcon(props.icon)} full />
    ) : (
        <Icon value={{ type: "glyph", iconClass: "glyphicon-star" }} full />
    );

    return (
        <RatingComponent
            animated={props.animation}
            className={className}
            disabled={readOnly ?? false}
            emptyIcon={emptyIcon}
            fullIcon={fullIcon}
            maximumValue={props.maximumStars ?? 5}
            style={parseStyle(props.style)}
            value={Number(props.maximumStars ?? 5) - 1}
        />
    );
}

export function getPreviewCss() {
    return require("./ui/rating-main.scss");
}
