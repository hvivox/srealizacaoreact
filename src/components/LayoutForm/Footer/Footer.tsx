
import styles from './Footer.module.scss'

export function Footer() {
    return (
        <footer className={styles.footer}>
            <p>
                &copy; {new Date().getFullYear()} Minha Empresa. Todos os direitos reservados.
            </p>
        </footer>
    )
}

