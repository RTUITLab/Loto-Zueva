import Image from 'next/image';
import styles from './page.module.scss';
import FormCreateLoto from '@/components/formCreateLoto';
import RTUITLAB_Logo from '@/public/svg/rtuitlab.svg';

export default function Home() {
  return (
    <div className={styles.page}>
      <aside>
        <h1>Лото Зуева</h1>
        <Image src={RTUITLAB_Logo} alt={'logo'} />
      </aside>
      <main>
        <FormCreateLoto />
      </main>
    </div>
  );
}
