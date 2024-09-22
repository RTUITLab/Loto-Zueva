import './style.css';
import './reset.css';
import Arrow from '@/public/svg/arrow.svg';
import Art1 from '@/public/svg/art-1.svg';
import Art2 from '@/public/svg/art-2.svg';
import Gift from '@/public/svg/gift.svg';
import One from '@/public/svg/one.svg';
import Zero from '@/public/svg/zero.svg';
import Logo from '@/public/image/logo.png';
import MIREA_Logo from '@/public/image/MIREA_Gerb_Black.png';
import RTUITLAB_Logo from '@/public/svg/rtuitlab.svg';
import Year_Logo from '@/public/svg/2024_YEAR.svg';
import Image from 'next/image';
import { getTicket, lengthTicket } from '@/storage/storageServerTicket';
import { notFound } from 'next/navigation';
import { transposeMatrix } from '@/utils/generator';

export default function Page({ params }: { params: { htmlPages: string } }) {
  if (Number(params.htmlPages) <= 0 || Number(params.htmlPages) > lengthTicket()) {
    notFound();
  }

  const ticket = transposeMatrix(getTicket(Number(params.htmlPages) - 1));
  return (
    <div className="layout">
      <p className="mini-title"> День рождения</p>
      <p className="IIT">ИИТ!</p>
      <div className="ticket">
        <p className="title-ticket">Билет</p>
        <p className="title-ticket ticket-num">№{params.htmlPages}</p>
      </div>
      {/* prettier-ignore */}
      <p className="text description">
        Лотерейный билет ко дню рождения <b>ИИТ</b> даст вам возможность выиграть вкусные и полезные призы и запомнить этот крутой день
        надолго!
        <br /> <br /> Если&nbsp;комбинация в&nbsp;столбце или&nbsp;строке совпала с&nbsp;выпавшей при&nbsp;розыгрыше, то&nbsp;вы&nbsp;обладатель одного из&nbsp;соответствующих призов, какого&nbsp;— выбирайте сами! 
      </p>

      <Image className="img iit" src={Logo} alt={''} />
      <Image className="img mirea" src={MIREA_Logo} width={120} height={132.74} alt={''} />
      <Image className="img itlab" src={RTUITLAB_Logo} alt={''} />
      <Image className="img year" src={Year_Logo} alt={''} />

      <div className="gifts vertical-g">
        <Image className="gift-v gift-v-1" src={Gift} alt={''} />
        <Image className="gift-v gift-v-2" src={Gift} alt={''} />
        <Image className="gift-v gift-v-3" src={Gift} alt={''} />
      </div>
      <div className="gifts horizontal-g">
        <Image className="gift-h gift-h-1" src={Gift} alt={''} />
        <Image className="gift-h gift-h-2" src={Gift} alt={''} />
        <Image className="gift-h gift-h-3" src={Gift} alt={''} />
        <Image className="gift-h gift-h-4" src={Gift} alt={''} />
        <Image className="gift-h gift-h-5" src={Gift} alt={''} />
        <Image className="gift-h gift-h-6" src={Gift} alt={''} />
      </div>

      <p className="text start">START</p>
      <p className="text end">END</p>

      <div className="table">
        <div className="unit unit-1">
          <div className="column column-1">
            {ticket[0].map((elem, index) => (
              <Image key={'column_0_image_' + index} className={'value-' + (index + 1) + ' black'} src={elem ? One : Zero} alt={''} />
            ))}
          </div>
          <Image className="arrow" src={Arrow} alt={''} />
        </div>
        <div className="unit unit-2">
          <div className="column column-2">
            {ticket[1].map((elem, index) => (
              <Image key={'column_1_image_' + index} className={'value-' + (index + 1) + ' black'} src={elem ? One : Zero} alt={''} />
            ))}
          </div>
          <Image className="arrow" src={Arrow} alt={''} />
        </div>
        <div className="unit unit-3">
          <div className="column column-3">
            {ticket[2].map((elem, index) => (
              <Image key={'column_2_image_' + index} className={'value-' + (index + 1) + ' black'} src={elem ? One : Zero} alt={''} />
            ))}
          </div>
          <Image className="arrow" src={Arrow} alt={''} />
        </div>
        <div className="unit unit-4">
          <div className="column column-4">
            {ticket[3].map((elem, index) => (
              <Image key={'column_3_image_' + index} className={'value-' + (index + 1) + ' black'} src={elem ? One : Zero} alt={''} />
            ))}
          </div>
          <Image className="arrow" src={Arrow} alt={''} />
        </div>
        <div className="unit unit-5">
          <div className="column column-5">
            {ticket[4].map((elem, index) => (
              <Image key={'column_4_image_' + index} className={'value-' + (index + 1) + ' black'} src={elem ? One : Zero} alt={''} />
            ))}
          </div>
          <Image className="arrow" src={Arrow} alt={''} />
        </div>
        <div className="unit unit-6">
          <div className="column column-6">
            {ticket[5].map((elem, index) => (
              <Image key={'column_5_image_' + index} className={'value-' + (index + 1) + ' black'} src={elem ? One : Zero} alt={''} />
            ))}
          </div>
        </div>
      </div>

      <Image className="art art-1" src={Art1} alt={''} />
      <Image className="art art-2" src={Art2} alt={''} />
    </div>
  );
}
