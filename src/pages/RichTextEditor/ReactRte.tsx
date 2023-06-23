import RichTextEditor from "react-rte";
import { useState } from "react";

const ReactRte = () => {
  const [value, setValue] = useState(RichTextEditor.createEmptyValue());
  return <RichTextEditor value={value}></RichTextEditor>;
};

export default ReactRte;
