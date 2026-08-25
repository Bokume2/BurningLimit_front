import { NavLink, type NavLinkProps } from 'react-router'
import styles from './HeaderLink.module.css'

export type HeaderLinkProps = NavLinkProps

export default function HeaderLink({
  className,
  children,
  to,
  ...props
}: HeaderLinkProps) {
  return (
    <NavLink
      to={to}
      className={(renderProps) => {
        const customClassName =
          typeof className === 'function'
            ? className(renderProps)
            : className

        return [
          styles.link,
          renderProps.isActive ? styles.active : '',
          customClassName,
        ]
          .filter(Boolean)
          .join(' ')
      }}
      {...props}
    >
      {children}
    </NavLink>
  )
}
