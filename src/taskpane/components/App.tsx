import * as React from "react";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertText } from "../taskpane";
import HelloWorld from "../components/HelloWorld";
import TemplateTree from "./TemplateTree";

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
      <TemplateTree />
      <HelloWorld />
    </div>
  );
};

export default App;
