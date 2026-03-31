import * as React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export type TreeToggleHandler = (
  e: React.SyntheticEvent | null,
  itemId: string,
  isSelected: boolean
) => void;

export const ICONS1_ID = "cpl/icons1";

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

type Props = {
  onItemSelectionToggle?: TreeToggleHandler;
  folders: Folder[];
  files: File[];
};

export default function TemplateTree(props: Props)
 {
  const { onItemSelectionToggle, folders, files } = props;
  const [expanded, setExpanded] = React.useState<string[]>([]);

const FolderLabel = ({ id, text }: { id: string; text: string }) => {
  const isOpen = expanded.includes(id);
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        lineHeight: 1.4,
        paddingTop: 1,
      }}
    >
      {isOpen ? (
        <FolderOpenIcon sx={{ fontSize: 18, color: "#555" }} />
      ) : (
        <FolderIcon sx={{ fontSize: 18, color: "#555" }} />
      )}
      <span>{text}</span>
    </span>
  );
};

const FileLabel = ({ text }: { text: string }) => {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        lineHeight: 1.4,
        paddingTop: 1,
      }}
    >
      <InsertDriveFileIcon sx={{ fontSize: 18, color: "#666" }} />
      <span>{text}</span>
    </span>
  );
};


  // Get top-level folders (parent_id is null)
  const topLevelFolders = folders.filter(f => f.parent_id === null);

  // Get top-level files (folder_id is null)
  const topLevelFiles = files.filter(f => f.folder_id === null);

  // Show empty state if no data
  if (folders.length === 0 && files.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
        Melden Sie sich an, um Ihre Dateien zu sehen
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginTop: 12 }}>
        <SimpleTreeView
          onItemSelectionToggle={onItemSelectionToggle}
          expandedItems={expanded}
          onExpandedItemsChange={(_, ids) => setExpanded(ids as string[])}
        >
          {topLevelFolders.map(folder => (
            <TreeItem
              key={folder.id}
              itemId={folder.id}
              label={<FolderLabel id={folder.id} text={folder.name} />}
            />
          ))}
          {topLevelFiles.map(file => (
            <TreeItem
              key={file.id}
              itemId={file.id}
              label={<FileLabel text={file.name} />}
            />
          ))}
        </SimpleTreeView>
      </div>
    </div>
  );
}
