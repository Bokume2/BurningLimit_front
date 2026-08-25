import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { paths } from '../../../../app/router/paths'
import googleLogo from '../../../../assets/google-g-logo.png'
import {
  createAccount,
  getAuthenticationErrorMessage,
  loginWithEmail,
  loginWithGoogle,
  requestPasswordReset,
} from '../../model/auth'
import styles from './AuthForm.module.css'

export type AuthMode = 'login' | 'signup'

type AuthFormProps = {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSignup = mode === 'signup'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') || '')
    const passwordConfirmation = String(
      formData.get('passwordConfirmation') || '',
    )

    setErrorMessage('')
    setSuccessMessage('')

    if (isSignup && password !== passwordConfirmation) {
      setErrorMessage('確認用パスワードが一致しません。')
      return
    }

    setIsSubmitting(true)
    try {
      if (isSignup) {
        await createAccount(email, password)
      } else {
        await loginWithEmail(
          email,
          password,
          formData.get('rememberMe') === 'on',
        )
      }
      navigate(paths.dashboard)
    } catch (error) {
      setErrorMessage(getAuthenticationErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    setIsSubmitting(true)
    try {
      await loginWithGoogle()
      navigate(paths.dashboard)
    } catch (error) {
      setErrorMessage(getAuthenticationErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordReset = async () => {
    setErrorMessage('')
    setSuccessMessage('')
    if (!email) {
      setErrorMessage('メールアドレスを入力してください。')
      return
    }

    setIsSubmitting(true)
    try {
      await requestPasswordReset(email)
      setSuccessMessage('パスワード再設定メールを送信しました。')
    } catch (error) {
      setErrorMessage(getAuthenticationErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
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

      <form
        className={styles.form}
        aria-busy={isSubmitting}
        onSubmit={handleSubmit}
      >
        <div className={styles.field}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            disabled={isSubmitting}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label htmlFor="password">パスワード</label>
            {!isSignup && (
              <button
                className={styles.textButton}
                type="button"
                disabled={isSubmitting}
                onClick={handlePasswordReset}
              >
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
              disabled={isSubmitting}
              required
            />
            <button
              className={styles.passwordToggle}
              type="button"
              aria-label={isPasswordVisible ? 'パスワードを隠す' : 'パスワードを表示'}
              aria-pressed={isPasswordVisible}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              required
            />
          </div>
        )}

        {!isSignup && (
          <label className={styles.rememberMe}>
            <input name="rememberMe" type="checkbox" disabled={isSubmitting} />
            <span>ログイン状態を保持する</span>
          </label>
        )}

        {errorMessage && (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className={styles.successMessage} role="status">
            {successMessage}
          </p>
        )}

        <button
          className={styles.primaryButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? '処理中...'
            : isSignup
              ? 'アカウントを作成'
              : 'ログイン'}
        </button>

        <div className={styles.divider} role="separator">
          <span>または</span>
        </div>

        <button
          className={styles.googleButton}
          type="button"
          disabled={isSubmitting}
          onClick={handleGoogleLogin}
        >
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
