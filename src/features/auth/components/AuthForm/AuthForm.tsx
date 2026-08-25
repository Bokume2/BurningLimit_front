import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { paths } from '../../../../app/router/paths'
import googleLogo from '../../../../assets/google-g-logo.png'
import styles from './AuthForm.module.css'

export type AuthMode = 'login' | 'signup'

type AuthFormProps = {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isSignup = mode === 'signup'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className={styles.authForm}>
      <nav className={styles.modeTabs} aria-label="認証画面">
        <Link
          className={styles.modeTab}
          data-active={!isSignup}
          aria-current={!isSignup ? 'page' : undefined}
          to={paths.login}
        >
          ログイン
        </Link>
        <Link
          className={styles.modeTab}
          data-active={isSignup}
          aria-current={isSignup ? 'page' : undefined}
          to={paths.signup}
        >
          アカウント作成
        </Link>
      </nav>

      <header className={styles.heading}>
        <h1>{isSignup ? 'アカウントを作成' : 'ログイン'}</h1>
        <p>
          {isSignup
            ? 'メールアドレスとパスワードを入力してください。'
            : '登録済みのメールアドレスで続けてください。'}
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password">パスワード</label>
            {!isSignup && (
              <button className={styles.textButton} type="button">
                パスワードを忘れた方
              </button>
            )}
          </div>
          <div className={styles.passwordField}>
            <input
              id="password"
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder={isSignup ? '8文字以上' : 'パスワードを入力'}
              minLength={8}
              required
            />
            <button
              className={styles.passwordToggle}
              type="button"
              aria-label={isPasswordVisible ? 'パスワードを隠す' : 'パスワードを表示'}
              aria-pressed={isPasswordVisible}
              onClick={() => setIsPasswordVisible((current) => !current)}
            >
              {isPasswordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isSignup && (
          <div className={styles.field}>
            <label htmlFor="password-confirmation">パスワード（確認）</label>
            <input
              id="password-confirmation"
              name="passwordConfirmation"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="もう一度入力"
              minLength={8}
              required
            />
          </div>
        )}

        {!isSignup && (
          <label className={styles.rememberMe}>
            <input name="rememberMe" type="checkbox" />
            <span>ログイン状態を保持する</span>
          </label>
        )}

        <button className={styles.primaryButton} type="submit">
          {isSignup ? 'アカウントを作成' : 'ログイン'}
        </button>

        <div className={styles.divider} role="separator">
          <span>または</span>
        </div>

        <button className={styles.googleButton} type="button">
          <img className={styles.googleMark} src={googleLogo} alt="" />
          {isSignup ? 'Googleでアカウント作成' : 'Googleでログイン'}
        </button>

        {isSignup && (
          <p className={styles.terms}>
            アカウントを作成することで、利用規約とプライバシーポリシーに同意したものとみなされます。
          </p>
        )}
      </form>
    </div>
  )
}
