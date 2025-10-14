import * as React from "react";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertText } from "../taskpane";
import HelloWorld from "../components/HelloWorld";
import LibraryController from "./LibraryController";
import InsertSelection from "./InsertSelection";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = () => {


  const styles = useStyles();

  return (
    <div className={styles.root}>
      <LibraryController />
      <InsertSelection />
    </div>
  );
};

export default App;
