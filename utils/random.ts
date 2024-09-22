export default function random(line: number, column: number) {
  const tableElement: boolean[][] = [];

  for (let i = 0; i < line; i++) {
    const buffer: boolean[] = [];
    for (let j = 0; j < column; j++) {
      buffer.push(Boolean(Math.random() < 0.5));
    }
    tableElement.push(buffer);
  }

  return tableElement;
}
