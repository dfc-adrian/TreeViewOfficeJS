import * as React from "react";
import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Typography from "@mui/material/Typography";

export default function BasicSimpleTreeView() {
    const [selected, setSelected] = React.useState<string | null>(null);
    
    const handleSelect = (
      _event: React.SyntheticEvent | null,
      itemId: string,
      isSelected: boolean
    ) => {
      if (isSelected) {
        setSelected(itemId);
      }
    };
    








  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <SimpleTreeView onItemSelectionToggle={handleSelect}>
        <TreeItem itemId="cpl" label="ChartPanda Library">
          <TreeItem itemId="cpl/buttons" label="Buttons" />
          <TreeItem itemId="cpl/icons1" label="Icons1" />
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
      <Typography>
        {selected == null ? "No item selection recorded" : `Last selected item: ${selected}`}
      </Typography>
    </Box>
  );
}
