import * as React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";


export type TreeToggleHandler = (
  e: React.SyntheticEvent | null,
  itemId: string,
  isSelected: boolean
) => void;

export const ICONS1_ID = "cpl/icons1";

export default function TemplateTree({ onItemSelectionToggle }: { onItemSelectionToggle?: TreeToggleHandler }) {
  return (
    <SimpleTreeView onItemSelectionToggle={onItemSelectionToggle}>
      <TreeItem itemId="cpl" label="ChartPanda Library" >
        <TreeItem itemId="cpl/buttons" label="Buttons" />
        <TreeItem itemId={ICONS1_ID} label="Icons1" />
        <TreeItem itemId="cpl/kpi-cards" label="KPI Cards" />
        <TreeItem itemId="cpl/nochcharts" label="NochCharts" />
        <TreeItem itemId="cpl/nocheine" label="NochEine" />
        <TreeItem itemId="cpl/starters" label="Starters" />
        <TreeItem itemId="cpl/tables" label="Tables">
          <TreeItem itemId="cpl/tables/test" label="Test">
            <TreeItem itemId="cpl/tables/test/file1" label="File1" />
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </SimpleTreeView>
  );
}
