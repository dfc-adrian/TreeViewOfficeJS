import * as React from "react";
import TextInsertion from "./TextInsertion";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertText } from "../taskpane";
import HelloWorld from "../components/HelloWorld";
import LibraryController from "./LibraryController";
import Header from "./Header";
import { initFileStorage } from "../../services/supabase";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
}

interface File {
  id: string;
  name: string;
  folder_id: string | null;
}

const App: React.FC<AppProps> = () => {
  const [folders, setFolders] = React.useState<Folder[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);

  // Set taskpane width on mount
  React.useEffect(() => {
    const officeAny = Office as any;
    if (officeAny?.extensionLifeCycle?.taskpane?.setWidth) {
      try {
        officeAny.extensionLifeCycle.taskpane.setWidth(600);
        console.log('✅ Taskpane width set to 500px');
      } catch (error) {
        console.warn('⚠️ Could not set taskpane width:', error);
      }
    }
  }, []);

  const handleLoginSuccess = async () => {
    try {
      console.log('🔄 Loading file storage...');
      const data = await initFileStorage();
      console.log('✅ Init successful:', data);

      if (data.folders) {
        setFolders(data.folders);
      }
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error: any) {
      console.error('❌ Init failed:', error.message);
    }
  };

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header onLoginSuccess={handleLoginSuccess} />
      <LibraryController folders={folders} files={files} />
    </div>
  );
};

export default App;
