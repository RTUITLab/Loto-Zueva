import Style from './categoryElement.module.scss';
import { Dispatch, SetStateAction } from 'react';
import Cancel from '@/public/svg/cancel-01-stroke-rounded.svg';
import Image from 'next/image';

type Props = {
  index: number;
  title: string;
  count: number;
  deleteFunction: Dispatch<SetStateAction<{ title: string; count: number }[]>>;
  originalArray: { title: string; count: number }[];
};

export default function CategoryElement({ index, title, count, deleteFunction, originalArray }: Props) {
  return (
    <div className={Style.Element}>
      <h4>{title}</h4>
      <div>
        <p>Количество: {count}</p>
        <button onClick={() => deleteFunction(originalArray.filter((element, indexFilter) => indexFilter !== index))}>
          <Image src={Cancel} alt={'delete'} />
        </button>
      </div>
    </div>
  );
}
