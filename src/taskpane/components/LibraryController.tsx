import * as React from "react";
import TemplateTree, { ICONS1_ID, TreeToggleHandler } from "../components/TemplateTree";

const ICONS1_URL = "http://localhost:8088/get-file";

//Helper to transform ArrayBuffer to Base64 string for loading
function toBase64(buf: ArrayBuffer): string {
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export default function LibraryController() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
    
  //Main Calls for Functions
  const onToggle: TreeToggleHandler = async (_e, id, isSel) => {
    if(!isSel) return;
    setSelected(id);
  };

  React.useEffect(() => {
    if (!selected) return;
    if (selected === ICONS1_ID) {
      (async () => {
        await loadIcons1();
      })();
    } else {
      (async () => {
        await deleteSheetIfExists();
      })();
    }
  }, [selected]);

  /* ---------------------------LOAD SHEET---------------------------*/
  const loadIcons1 = async () => {
    setBusy(true);
    try {
      const res = await fetch(ICONS1_URL, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const base64 = toBase64(await res.arrayBuffer());

      await Excel.run(async (ctx) => {
        const wb = ctx.workbook;

        // insert all worksheets at end
        wb.insertWorksheetsFromBase64(base64, {
          sheetNamesToInsert: [], // empty => all
          positionType: Excel.WorksheetPositionType.end,
        });
        await ctx.sync();
      });
    } catch (e) {
      console.error("Icons1 load failed:", e);
    } finally {
      setBusy(false);
    }
  };

  /* ---------------------------CLOSE LAST SHEET---------------------------*/

  async function deleteSheetIfExists() {
    await Excel.run(async (ctx) => {
      const sheets = ctx.workbook.worksheets;
      sheets.load("items/name");
      await ctx.sync();
      const allSheets = sheets.items;
      console.log(
        "All sheets:",
        allSheets.map((s) => s.name)
      );
      if (allSheets.length > 0) {
        const lastSheet = allSheets[allSheets.length - 1];
        lastSheet.delete();
        await ctx.sync();
      }
    });
  }

  return (
    <>
      <TemplateTree onItemSelectionToggle={onToggle} />
      <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: "20", fontWeight: "bold",textAlign: "center", color: "green" }}>
        {busy ? "working..." : (selected ?? "—")}
      </div>
    </>
  );
}
