import React, { useEffect, useRef } from "react";
import { Button, Field, makeStyles, tokens } from "@fluentui/react-components";

/* global Excel */

const useStyles = makeStyles({
  root: {
    padding: "12px 16px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: "12px",
  },
  row: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  hint: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  shortcut: {
    fontFamily: "monospace",
    fontSize: tokens.fontSizeBase200,
    padding: "2px 6px",
    borderRadius: "4px",
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
    height: 0,
    width: 0,
  },
});

function logScreenInfo() {
  const info = {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    screenAvailWidth: window.screen.availWidth,
    screenAvailHeight: window.screen.availHeight,

    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,

    devicePixelRatio: window.devicePixelRatio,

    // Skalierung relativ zu Windows 96 DPI
    scalePercent: Math.round(window.devicePixelRatio * 100),

    // geschätzte DPI (nicht exakt, aber guter Näherungswert)
    approxDPI: Math.round(96 * window.devicePixelRatio),

    // weitere Browser-Infos, falls nützlich
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
  };

  console.log("=== Screen Info ===");
  console.table(info);
}

const FocusSwitcher: React.FC = () => {
  const styles = useStyles();
  const focusAnchorRef = useRef<HTMLInputElement | null>(null);
  // Focus Excel sheet
  const focusSheet = async () => {
    console.log("Shortcut: Fokus → Sheet");
    logScreenInfo();
    try {
      await Excel.run(async (ctx) => {
        const sheet = ctx.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getRange("A1");

        // Write a zero-width space to trigger focus on the grid
        range.values = [["Test"]];
        await ctx.sync();

        // Clear it again so nothing visible remains
        //range.clear();
        //await ctx.sync();
      });
    } catch (error) {
      // Optional: add logging here
      console.error("Error while focusing sheet:", error);
    }
  };

  // Focus task pane
  const focusTaskpane = () => {
    // Bring task pane window to front (if possible)
    console.log("Focusing task pane window");
    window.focus();

    // Focus a concrete element inside the pane
    if (focusAnchorRef.current) {
      focusAnchorRef.current.focus();
    }
  };

  // Register keyboard shortcuts
  useEffect(() => {
    // Key handler for shortcuts
    const handler = (event: KeyboardEvent) => {
      // Ctrl + Alt + 1 => focus sheet
      console.log("Keydown:", event.key, "Ctrl:", event.ctrlKey);
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        focusSheet();
        return;
      }

      // Ctrl + Alt + 2 => focus task pane
      if (event.ctrlKey && event.key === "j") {
        event.preventDefault();
        focusTaskpane();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div className={styles.root}>
      {/* Invisible anchor that receives focus when we switch to the task pane */}
      <input ref={focusAnchorRef} className={styles.hiddenInput} aria-hidden="true" tabIndex={-1} />

      <div className={styles.row}>
        <Field label="Fokus-Steuerung">
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="small" onClick={focusSheet}>
              Fokus → Sheet (Ctrl+d)
            </Button>
            <Button size="small" onClick={focusTaskpane}>
              Fokus → Taskpane (Ctrl+j)
            </Button>
          </div>
        </Field>
        <div className={styles.hint}>
          <div>
            <span className={styles.shortcut}>Ctrl+Alt+1</span> wechselt zum aktiven Sheet.
          </div>
          <div>
            <span className={styles.shortcut}>Ctrl+Alt+2</span> holt den Fokus zurück in die
            Taskpane.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusSwitcher;
