import * as React from "react";
import TemplateTree, { ICONS1_ID, TreeToggleHandler } from "../components/TemplateTree";

export default function LibraryController() {
  const [selected, setSelected] = React.useState<string | null>(null);

  const onToggle: TreeToggleHandler = (_e, id, isSel) => {
    setSelected(isSel ? id : null);
    if (id === ICONS1_ID && isSel) console.log("HelloWorld");
  };

  return (
    <>
      <TemplateTree onItemSelectionToggle={onToggle} />
      <div style={{ marginTop: 8, fontFamily: "monospace", textAlign: "center" }}>
        {selected ?? "—"}
      </div>
    </>
  );
}
