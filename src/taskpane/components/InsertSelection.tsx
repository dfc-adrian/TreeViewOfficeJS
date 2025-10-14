import React, { useState } from "react";
import { Button } from "@fluentui/react-button";

export default function CopySelectionToSheet1Button() {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      await Excel.run(async (context) => {
        const wb = context.workbook;
        // Read User Selection

        const src = wb.getSelectedRange();
        src.load(["rowCount", "columnCount", "address", "worksheet/name"]);
        await context.sync();

        // Get Sheet1 or create if doesn´t exists
        let dest = wb.worksheets.getItemOrNullObject("Sheet1");
        await context.sync();
        if (dest.isNullObject){
          dest = wb.worksheets.add("Sheet1");  
          await context.sync();
        } 

        // Place it at B2
        const destRange = dest
          .getRange("B2")
          .getResizedRange(src.rowCount - 1, src.columnCount - 1);

        // copy all
        destRange.copyFrom(src, Excel.RangeCopyType.all);
        dest.activate();
        await context.sync();
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
      <Button appearance="primary" onClick={onClick} disabled={loading}>
        {loading ? "Kopiere…" : "Auswahl → Sheet1"}
      </Button>
    </div>
  );
}
