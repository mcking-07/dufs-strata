import { cx, logo_svg } from '../common';
import { config } from '../config';
import { logo_src } from '../services';
import type { LogoPropsType } from '../types';

const Logo = ({ className }: LogoPropsType) => {
  if (config.logo.file) return <img src={logo_src(config.logo)} alt="" aria-hidden="true" draggable={false} className={cx('block object-contain', className)} />;
  return <span aria-hidden="true" className={cx('block [&>svg]:size-full', className)} dangerouslySetInnerHTML={{ __html: logo_svg(config.logo.tones) }} />;
};

export { Logo };
