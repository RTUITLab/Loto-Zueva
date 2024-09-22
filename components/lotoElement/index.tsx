'use client';
import Image from 'next/image';
import One from '@/public/svg/one.svg';
import Zero from '@/public/svg/zero.svg';
import Style from './lotoElement.module.scss';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  indexI: number;
  indexJ: number;
  status: boolean;
  tableElement: boolean[][];
  setTableElement: Dispatch<SetStateAction<boolean[][] | null>>;
};

export default function LotoElement({ status, indexI, indexJ, tableElement, setTableElement }: Props) {
  function change(indexIF: number, indexJF: number, tableElementFunc: boolean[][]) {
    tableElementFunc[indexIF][indexJF] = !tableElementFunc[indexIF][indexJF];
    setTableElement(new Array(...tableElementFunc));
  }

  return (
    <button className={Style.LotoElement} onClick={() => change(indexI, indexJ, tableElement)}>
      <Image src={status ? One : Zero} alt={status ? 'one' : 'zero'} />
    </button>
  );
}
