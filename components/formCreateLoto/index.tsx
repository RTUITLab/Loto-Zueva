'use client';
import Style from './formCreateLoto.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import CategoryElement from '@/components/categoryElement';
import { getData, openDB, replaceData } from '@/utils/indexedDB';
import LotoElement from '@/components/lotoElement';
import random from '@/utils/random';
import generator, { Ticket } from '@/utils/generator';
import { checkTicketMatches } from '@/utils/check';
import TicketElement from '@/components/ticketElement';

export default function FormCreateLoto() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const refTitleColumns = useRef<null | HTMLInputElement>(null);
  const refCountColumns = useRef<null | HTMLInputElement>(null);
  const refTitleRows = useRef<null | HTMLInputElement>(null);
  const refCountRows = useRef<null | HTMLInputElement>(null);
  const refForm = useRef<null | HTMLFormElement>(null);
  const [categoryColumns, setCategoryColumns] = useState<{ title: string; count: number }[]>([]);
  const [categoryRows, setCategoryRows] = useState<{ title: string; count: number }[]>([]);
  const maxColumns = 6;
  const maxRows = 3;
  const [tableElement, setTableElement] = useState<boolean[][] | null>(null);
  const [inputValue, setInputValue] = useState<string>('0');
  const [ticket, setTicket] = useState<Ticket[] | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [maxValue, setMaxValue] = useState<string>('1');
  const [minValue, setMinValue] = useState<string>('1');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxValue(event.target.value);
  };

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinValue(event.target.value);
  };

  useEffect(() => {
    if (inputValue === '0' || Number(inputValue) < sumTicketWins(categoryColumns, categoryRows)) {
      setInputValue(String(sumTicketWins(categoryColumns, categoryRows)));
    }
  }, [categoryColumns, categoryRows]);

  useEffect(() => {
    setTableElement(random(3, 6));
  }, []);

  useEffect(() => {
    // Открываем базу данных при монтировании компонента
    openDB('myDataBaseNew', 9)
      .then((database) => {
        setDb(database);
        console.log('open database');
      })
      .catch((error) => {
        console.error('Error opening database:', error);
      });
  }, []);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('columns')) {
      getData(db, 'columns')
        .then((data) => {
          setCategoryColumns(data); // Устанавливаем данные в useState
        })
        .catch((error) => {
          setCategoryColumns([]);
          console.error('Error fetching data for columns:', error);
        });
    }
  }, [db]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('rows')) {
      getData(db, 'rows')
        .then((data) => {
          setCategoryRows(data); // Устанавливаем данные в useState
        })
        .catch((error) => {
          setCategoryRows([]);
          console.error('Error fetching data for rows:', error);
        });
    }
  }, [db]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('map')) {
      getData(db, 'map')
        .then((data) => {
          setTableElement(data); // Устанавливаем данные в useState
        })
        .catch((error) => {
          setTableElement(null);
          console.error('Error fetching data for rows:', error);
        });
    }
  }, [db]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('tickets')) {
      getData(db, 'tickets')
        .then((data) => {
          setTicket(data); // Устанавливаем данные в useState
        })
        .catch((error) => {
          setTicket(null);
          console.error('Error fetching data for rows:', error);
        });
    }
  }, [db]);

  useEffect(() => {
    if (ticket) {
      fetch('/server', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
    }
  }, [ticket]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('quantity')) {
      getData(db, 'quantity')
        .then((data) => {
          setInputValue(data.length !== 0 ? String(data[0].value) : '0'); // Устанавливаем данные в useState
        })
        .catch((error) => {
          setInputValue('0');
          console.error('Error fetching data for rows:', error);
        });
    }
  }, [db]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('columns') && categoryColumns) {
      replaceData(db, 'columns', categoryColumns)
        .then(() => {
          console.log('Data replaced successfully');
        })
        .catch((error) => {
          console.error('Error replacing data:', error);
        });
    }
  }, [categoryColumns]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('rows') && categoryRows) {
      replaceData(db, 'rows', categoryRows)
        .then(() => {
          console.log('Data replaced successfully');
        })
        .catch((error) => {
          console.error('Error replacing data:', error);
        });
    }
  }, [categoryRows]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('map') && tableElement) {
      replaceData(db, 'map', tableElement)
        .then(() => {
          console.log('Data replaced successfully');
        })
        .catch((error) => {
          console.error('Error replacing data:', error);
        });
    }
  }, [tableElement]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('tickets') && ticket) {
      replaceData(db, 'tickets', ticket)
        .then(() => {
          fetch('/server', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticket),
          });
          console.log('Data replaced successfully');
        })
        .catch((error) => {
          console.error('Error replacing data:', error);
        });
    }
  }, [ticket]);

  useEffect(() => {
    if (db && db.objectStoreNames.contains('quantity') && inputValue && inputValue !== '') {
      replaceData(db, 'quantity', [{ value: Number(inputValue) }])
        .then(() => {
          console.log('Data replaced successfully');
        })
        .catch((error) => {
          console.error('Error replacing data:', error);
        });
    }
  }, [inputValue]);

  function CreateCategoryColumns() {
    if (refCountColumns.current && refTitleColumns.current && categoryColumns.length !== maxColumns) {
      if (refCountColumns.current.value && refTitleColumns.current.value) {
        setCategoryColumns([...categoryColumns, { title: refTitleColumns.current.value, count: Number(refCountColumns.current.value) }]);
      }
    }
  }

  function CreateCategoryRows() {
    if (refCountRows.current && refTitleRows.current && categoryRows.length !== maxRows) {
      if (refCountRows.current.value && refTitleRows.current.value) {
        setCategoryRows([...categoryRows, { title: refTitleRows.current.value, count: Number(refCountRows.current.value) }]);
      }
    }
  }

  function submitForm(event: SubmitEvent) {
    event.preventDefault();
  }

  useEffect(() => {
    if (refForm.current) {
      refForm.current.addEventListener('submit', submitForm);
    }

    return () => {
      if (refForm.current) {
        refForm.current.removeEventListener('submit', submitForm);
      }
    };
  }, [refForm.current]);

  function sumTicketWins(columns: { title: string; count: number }[], rows: { title: string; count: number }[]) {
    let sum = 0;
    for (let i = 0; i < rows.length; i++) {
      sum += rows[i].count;
    }
    for (let i = 0; i < columns.length; i++) {
      sum += columns[i].count;
    }
    return sum;
  }

  const printPages: { type: string; link: string }[] = ticket
    ? ticket.map((elem, index) => {
        return {
          type: checkTicketMatches(
            elem,
            tableElement ? tableElement : [[]],
            categoryColumns.map((elem) => elem.title),
            categoryRows.map((elem) => elem.title),
          ),
          link: '/' + (index + 1),
        };
      })
    : [];

  const typePrint: string[] = [...categoryRows.map((elem) => elem.title), ...categoryColumns.map((elem) => elem.title)];

  const printMultiplePages = useCallback(
    (printPages: string[]) => {
      if (isPrinting) return; // блокируем повторный запуск
      setIsPrinting(true);

      let index = 0;

      const printNextPage = () => {
        if (index >= printPages.length) {
          setIsPrinting(false); // разблокируем, когда все страницы напечатаны
          return;
        }

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = printPages[index];

        iframe.onload = () => {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            iframe.contentWindow.onafterprint = () => {
              document.body.removeChild(iframe); // удаляем iframe
              index++; // увеличиваем индекс
              printNextPage(); // печатаем следующую страницу
            };
          }
        };

        document.body.appendChild(iframe);
      };

      printNextPage(); // запускаем печать первой страницы
    },
    [isPrinting],
  );

  return (
    <form ref={refForm} className={Style.Form}>
      <fieldset>
        <legend>Категории в столбце</legend>
        <div>
          <input
            ref={refTitleColumns}
            disabled={!db || categoryColumns.length === maxColumns}
            type="text"
            placeholder="Введите название категории подарков"
          />
          <input
            ref={refCountColumns}
            disabled={!db || categoryColumns.length === maxColumns}
            type="number"
            min="1"
            placeholder="Введите количество призов данной категории подарков"
          />
          <button onClick={() => CreateCategoryColumns()}>
            <h4>Создать</h4>
          </button>
        </div>
        <article>
          <h4>
            {categoryColumns.length} из {maxColumns}
          </h4>
          {categoryColumns.map((item, index) => (
            <CategoryElement
              key={'category_column_element_' + index}
              index={index}
              title={item.title}
              count={item.count}
              deleteFunction={setCategoryColumns}
              originalArray={categoryColumns}
            />
          ))}
        </article>
      </fieldset>
      <fieldset>
        <legend>Категории в линии</legend>
        <div>
          <input
            ref={refTitleRows}
            disabled={!db || categoryRows.length === maxRows}
            type="text"
            placeholder="Введите название категории подарков"
          />
          <input
            ref={refCountRows}
            disabled={!db || categoryRows.length === maxRows}
            type="number"
            min="1"
            placeholder="Введите количество призов данной категории подарков"
          />
          <button onClick={() => CreateCategoryRows()}>
            <h4>Создать</h4>
          </button>
        </div>
        <article>
          <h4>
            {categoryRows.length} из {maxRows}
          </h4>
          {categoryRows.map((item, index) => (
            <CategoryElement
              key={'category_row_element_' + index}
              index={index}
              title={item.title}
              count={item.count}
              deleteFunction={setCategoryRows}
              originalArray={categoryRows}
            />
          ))}
        </article>
      </fieldset>
      <fieldset>
        <legend>Генерация комбинаций</legend>
        <div>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            min={sumTicketWins(categoryColumns, categoryRows)}
            placeholder="Введите количество билетов"
          />
          <div className={Style.Heading}>
            <h4>Количество призов: {sumTicketWins(categoryColumns, categoryRows)}</h4>
          </div>
          <button onClick={() => setTableElement(random(3, 6))}>
            <h4>Пересоздать комбинацию</h4>
          </button>
          <button
            onClick={() =>
              tableElement
                ? setTicket(
                    generator(
                      Number(inputValue),
                      sumTicketWins(categoryColumns, categoryRows),
                      tableElement,
                      categoryRows.map((elem) => elem.count),
                      categoryColumns.map((elem) => elem.count),
                    ),
                  )
                : console.log('')
            }>
            <h4>Сгенерировать билеты</h4>
          </button>
          {ticket && (
            <>
              <div className={Style.Heading}>
                <h4>Печать</h4>
              </div>
              <article className={Style.DivArticle}>
                <button onClick={() => printMultiplePages(printPages.map((elem) => elem.link))} disabled={isPrinting}>
                  <h4>Напечатать все билеты</h4>
                </button>
                {typePrint.map((elem, index) => (
                  <button
                    key={'print_button_' + index}
                    onClick={() => printMultiplePages(printPages.filter((elem2) => elem === elem2.type).map((elem3) => elem3.link))}
                    disabled={isPrinting}>
                    <h4>Напечатать все билеты c призом &quot;{elem}&quot;</h4>
                  </button>
                ))}
                <div className={Style.Input}>
                  <article>
                    <h4>С какого билета печатать</h4>
                    <h4>По какой билет включительно печатать</h4>
                    <h4 />
                  </article>
                  <div>
                    <input type="number" value={minValue} onChange={handleMinChange} placeholder="Введите с какого билета начать печать" />
                    <input
                      type="number"
                      value={maxValue}
                      onChange={handleMaxChange}
                      placeholder="Введите до какого включительно печатать"
                    />
                    <button
                      onClick={() =>
                        Number(minValue) > 0 && Number(maxValue) >= Number(minValue)
                          ? printMultiplePages(
                              printPages
                                .filter((elem, index) => Number(minValue) <= index + 1 && index + 1 <= Number(maxValue))
                                .map((elem) => elem.link),
                            )
                          : console.log('error')
                      }
                      disabled={isPrinting}>
                      <h4>Печать</h4>
                    </button>
                  </div>
                </div>
              </article>
              {ticket.map((item, index) => (
                <TicketElement
                  key={'ticket_' + index}
                  number={index + 1}
                  type={checkTicketMatches(
                    item,
                    tableElement ? tableElement : [[]],
                    categoryColumns.map((elem) => elem.title),
                    categoryRows.map((elem) => elem.title),
                  )}
                />
              ))}
            </>
          )}
        </div>
        <article className={Style.TableArticle}>
          <div className={Style.RowsTitle}>
            {categoryRows.map((item, index) => (
              <div key={'title_rows_' + index}>
                <h4>{item.title + ' | ' + item.count}</h4>
              </div>
            ))}
            {categoryRows.length === 2 ? (
              <div>
                <h4 />
              </div>
            ) : categoryRows.length === 1 ? (
              <>
                <div>
                  <h4 />
                </div>
                <div>
                  <h4 />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <article>
            <div className={Style.ColumnTitle}>
              {categoryColumns.map((item, index) => (
                <div key={'title_column_' + index}>
                  <h4>{item.title + ' - ' + item.count}</h4>
                </div>
              ))}
            </div>
            <article className={Style.Table}>
              {tableElement &&
                tableElement.map((item, index) =>
                  item.map((item2, index2) => (
                    <LotoElement
                      key={'row_' + index + '_column_' + index2}
                      status={item2}
                      indexI={index}
                      indexJ={index2}
                      tableElement={tableElement}
                      setTableElement={setTableElement}
                    />
                  )),
                )}
            </article>
          </article>
        </article>
      </fieldset>
    </form>
  );
}
