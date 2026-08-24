import type { ButtonHTMLAttributes } from 'react'
import styles from './HeaderButton.module.css'

export type HeaderButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function HeaderButton({
  className,
  type = 'button',
  ...props
}: HeaderButtonProps) {
  const classNames = [styles.button, className].filter(Boolean).join(' ')

  return <button type={type} className={classNames} {...props} />
}
