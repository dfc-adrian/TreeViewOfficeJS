import * as React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export type TreeToggleHandler = (
  e: React.SyntheticEvent | null,
  itemId: string,
  isSelected: boolean
) => void;

export const ICONS1_ID = "cpl/icons1";

export default function TemplateTree({
  onItemSelectionToggle,
}: {
  onItemSelectionToggle?: TreeToggleHandler;
}) {
  const [lib, setLib] = React.useState<"cpl" | "priv">("cpl");

  return (
    <div>
      <ToggleButtonGroup
        value={lib}
        exclusive
        onChange={(_, v) => v && setLib(v)}
        aria-label="library switch"
        sx={{
          backgroundColor: "#eee",
          borderRadius: 2,
          p: 0.5,
          "& .MuiToggleButton-root": {
            textTransform: "none",
            color: "#666",
            border: "1px solid transparent",
            borderRadius: 1.5,
            px: 2,
            "&.Mui-selected": { backgroundColor: "#fff", borderColor: "#d9d9d9" },
          },
        }}
      >
        <ToggleButton value="cpl">ChartPanda Library</ToggleButton>
        <ToggleButton value="priv">Private Library</ToggleButton>
      </ToggleButtonGroup>

      <div style={{ marginTop: 12 }}>
        {lib === "cpl" ? (
          <SimpleTreeView onItemSelectionToggle={onItemSelectionToggle}>
            <TreeItem itemId="cpl" label="ChartPanda Library">
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
        ) : (
          <SimpleTreeView onItemSelectionToggle={onItemSelectionToggle}>
            <TreeItem itemId="private" label="Private Library">
              <TreeItem itemId="private/custom-buttons" label="Custom Buttons" />
              <TreeItem itemId="private/icons2" label="Icons2" />
              <TreeItem itemId="private/score-cards" label="Score Cards" />
              <TreeItem itemId="private/altcharts" label="AltCharts" />
              <TreeItem itemId="private/extra" label="Extra" />
              <TreeItem itemId="private/templates" label="Templates">
                <TreeItem itemId="private/templates/sample" label="Sample">
                  <TreeItem itemId="private/templates/sample/fileA" label="FileA" />
                </TreeItem>
              </TreeItem>
            </TreeItem>
          </SimpleTreeView>
        )}
      </div>
    </div>
  );
}
