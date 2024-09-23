import Link from 'next/link';
import Image from 'next/image';
import OpenSvg from '@/public/svg/share-03-stroke-rounded.svg';
import PrintSvg from '@/public/svg/printer-stroke-rounded.svg';
import Style from './ticketElement.module.scss';
import { useCallback } from 'react';

type Props = {
  number: number;
  type: string;
};

export default function TicketElement({ number, type }: Props) {
  // Функция для загрузки и печати страницы
  const handlePrint = useCallback(() => {
    const url = `/${number}`; // путь к странице для печати
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none'; // скрываем iframe
    iframe.src = url;

    iframe.onload = () => {
      if (iframe.contentWindow) {
        iframe.contentWindow.focus(); // устанавливаем фокус на iframe
        iframe.contentWindow.print(); // запускаем печать
      }
    };

    document.body.appendChild(iframe); // добавляем iframe в документ
  }, [number]);

  return (
    <div className={Style.TicketElement}>
      <article>
        <h4>Билет №{number}</h4>
        <h4>|</h4>
        <h4>{type}</h4>
      </article>
      <div>
        <button onClick={handlePrint}>
          <Image src={PrintSvg} alt={'печать'} />
        </button>
        <Link target="_blank" href={'/' + number}>
          <Image src={OpenSvg} alt={'просмотр'} />
        </Link>
      </div>
    </div>
  );
}
