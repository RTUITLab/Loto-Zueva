export type Ticket = boolean[][];

export function transposeMatrix(matrix: boolean[][]): boolean[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Создаем новый массив для транспонированной матрицы
  const transposedMatrix: boolean[][] = [];

  for (let i = 0; i < cols; i++) {
    const newRow: boolean[] = [];
    for (let j = 0; j < rows; j++) {
      newRow.push(matrix[j][i]);
    }
    transposedMatrix.push(newRow);
  }

  return transposedMatrix;
}

function tableComparison(rows: boolean[][], map: boolean[][]) {
  const transposeRows = transposeMatrix(rows);
  const transposeMap = transposeMatrix(map);

  for (let i = 0; i < transposeMap.length; i++) {
    if (transposeRows[i].toString() === transposeMap[i].toString()) {
      return true;
    }
  }
  return false;
}

export default function generator(
  totalTickets: number, // Количество всего билетов
  winningTicketsCount: number, // Количество выигрышных билетов
  winningMap: boolean[][], // Карта выигрышных комбинаций (двумерный булевый массив)
  rowGifts: number[], // Массив количества подарков в линию
  colGifts: number[], // Массив количества подарков в столбец
): Ticket[] {
  const tickets: Ticket[] = [];
  const rows = winningMap.length;
  const cols = winningMap[0].length;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rowGifts[i]; j++) {
      const buffer: boolean[][] = [];
      do {
        buffer.length = 0;
        for (let r = 0; r < rows; r++) {
          const coincidences: boolean[] = [];
          const coincidencesMap: boolean[] = [];
          buffer.push([]);
          if (i === r) {
            for (let c = 0; c < cols; c++) {
              buffer[r].push(winningMap[r][c]);
            }
          } else {
            while (coincidences.toString() === coincidencesMap.toString()) {
              coincidences.length = 0;
              coincidencesMap.length = 0;
              for (let c = 0; c < cols; c++) {
                coincidencesMap.push(winningMap[r][c]);
                coincidences.push(Boolean(Math.random() < 0.5));
              }
            }
            buffer[r] = coincidences;
          }
        }
      } while (tableComparison(new Array(...buffer), new Array(...winningMap)));
      tickets.push(buffer);
    }
  }

  const ReverseMap: boolean[][] = transposeMatrix(new Array(...winningMap));

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < colGifts[i]; j++) {
      const buffer: boolean[][] = [];
      do {
        buffer.length = 0;
        for (let r = 0; r < cols; r++) {
          const coincidences: boolean[] = [];
          const coincidencesMap: boolean[] = [];
          buffer.push([]);
          if (i === r) {
            for (let c = 0; c < rows; c++) {
              buffer[r].push(ReverseMap[r][c]);
            }
          } else {
            while (coincidences.toString() === coincidencesMap.toString()) {
              coincidences.length = 0;
              coincidencesMap.length = 0;
              for (let c = 0; c < rows; c++) {
                coincidencesMap.push(ReverseMap[r][c]);
                coincidences.push(Boolean(Math.random() < 0.5));
              }
            }
            buffer[r] = coincidences;
          }
        }
      } while (tableComparison(new Array(...buffer), new Array(...ReverseMap)));
      tickets.push(transposeMatrix(buffer));
    }
  }

  if (totalTickets !== winningTicketsCount) {
    for (let i = 0; i < totalTickets - winningTicketsCount; i++) {
      const buffer: boolean[][] = [];
      do {
        buffer.length = 0;
        for (let r = 0; r < cols; r++) {
          const coincidences: boolean[] = [];
          const coincidencesMap: boolean[] = [];
          buffer.push([]);
          while (coincidences.toString() === coincidencesMap.toString()) {
            coincidences.length = 0;
            coincidencesMap.length = 0;
            for (let c = 0; c < rows; c++) {
              coincidencesMap.push(ReverseMap[r][c]);
              coincidences.push(Boolean(Math.random() < 0.5));
            }
          }
          buffer[r] = coincidences;
        }
      } while (tableComparison(new Array(...buffer), new Array(...ReverseMap)));
      tickets.push(transposeMatrix(buffer));
    }
  }

  for (let i = tickets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tickets[i], tickets[j]] = [tickets[j], tickets[i]];
  }

  return tickets;
}
