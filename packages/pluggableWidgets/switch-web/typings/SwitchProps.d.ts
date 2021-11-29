/**
 * This file was generated from Switch.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";

export interface SwitchContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    id: string;
    booleanAttribute: EditableValue<boolean>;
    action?: ActionValue;
}

export interface SwitchPreviewProps {
    className: string;
    readOnly: boolean;
    style?: string;
    styleObject?: CSSProperties;
    booleanAttribute: string;
    action: {} | null;
}
