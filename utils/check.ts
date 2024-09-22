type Ticket = boolean[][];

export default function analyzeLotteryTickets(
  tickets: Ticket[], // Массив сгенерированных билетов
  winningMap: boolean[][], // Карта выигрышных комбинаций
) {
  console.log(tickets);
  const rows = winningMap.length;
  const cols = winningMap[0].length;

  // Счётчики совпадений
  let rowMatches = Array(rows).fill(0); // Количество совпадений по каждой строке
  let colMatches = Array(cols).fill(0); // Количество совпадений по каждому столбцу
  let noMatches = 0; // Количество билетов без совпадений
  let multiMatches = 0; // Количество билетов с двумя или более совпадениями

  // Функция для проверки совпадений строки
  function isRowMatch(ticket: Ticket, rowIndex: number): boolean {
    for (let c = 0; c < cols; c++) {
      if (ticket[rowIndex][c] !== winningMap[rowIndex][c]) {
        return false;
      }
    }
    return true;
  }

  // Функция для проверки совпадений столбца
  function isColMatch(ticket: Ticket, colIndex: number): boolean {
    for (let r = 0; r < rows; r++) {
      if (ticket[r][colIndex] !== winningMap[r][colIndex]) {
        return false;
      }
    }
    return true;
  }

  // Проход по каждому билету для анализа
  for (let ticket of tickets) {
    let matchesCount = 0; // Счётчик совпадений для текущего билета

    // Проверяем строки
    for (let r = 0; r < rows; r++) {
      if (isRowMatch(ticket, r)) {
        rowMatches[r]++;
        matchesCount++;
      }
    }

    // Проверяем столбцы
    for (let c = 0; c < cols; c++) {
      if (isColMatch(ticket, c)) {
        colMatches[c]++;
        matchesCount++;
      }
    }

    // Считаем билеты без совпадений
    if (matchesCount === 0) {
      noMatches++;
    }

    // Считаем билеты с двумя и более совпадениями
    if (matchesCount >= 2) {
      multiMatches++;
    }
  }

  // Вывод результатов
  console.log('Анализ лотерейных билетов:');
  console.log(`Совпадения по строкам:`);
  rowMatches.forEach((count, rowIndex) => {
    console.log(`Строка ${rowIndex + 1}: ${count} совпадений`);
  });
  console.log(`Совпадения по столбцам:`);
  colMatches.forEach((count, colIndex) => {
    console.log(`Столбец ${colIndex + 1}: ${count} совпадений`);
  });
  console.log(`Билетов без совпадений: ${noMatches}`);
  console.log(`Билетов с двумя и более совпадениями: ${multiMatches}`);
}

export function checkTicketMatches(
  ticket: Ticket, // Билет для проверки
  winningMap: boolean[][], // Карта выигрышных комбинаций
  column: string[],
  row: string[],
): string {
  const rows = winningMap.length;
  const cols = winningMap[0].length;

  // Функция для проверки совпадений строки
  function isRowMatch(ticket: Ticket, rowIndex: number): boolean {
    for (let c = 0; c < cols; c++) {
      if (ticket[rowIndex][c] !== winningMap[rowIndex][c]) {
        return false;
      }
    }
    return true;
  }

  // Функция для проверки совпадений столбца
  function isColMatch(ticket: Ticket, colIndex: number): boolean {
    for (let r = 0; r < rows; r++) {
      if (ticket[r][colIndex] !== winningMap[r][colIndex]) {
        return false;
      }
    }
    return true;
  }

  // Проверяем строки
  for (let r = 0; r < rows; r++) {
    if (isRowMatch(ticket, r)) {
      return row[r];
    }
  }

  // Проверяем столбцы
  for (let c = 0; c < cols; c++) {
    if (isColMatch(ticket, c)) {
      return column[c];
    }
  }

  // Если совпадений нет
  return 'Билет без подарка';
}
