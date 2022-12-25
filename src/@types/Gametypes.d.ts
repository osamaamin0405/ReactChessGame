interface BoardProps {
  width: number;
  height: number;
  bg: string;
  index: NotionIndex;
}

type NotionIndex = {
  x: number;
  y: string;
};
