import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button';
import { useUser } from '../../hook/use-user';
import styles from './styles.module.css';

export function Login() {
    // Estados para armazenar email, senha e erro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Hook de autenticação e navegação
    const { getUserInfo } = useUser();
    const navigate = useNavigate();

    // Envia o formulário de login
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Impede o comportamento padrão de envio do formulário

        try {
            const user = await getUserInfo(e, email, password);

            // Se as credenciais forem incorretas, exibe a mensagem de erro
            if (!user) {
                setErrorMessage('Email ou senha incorretos');
                return;
            }

            // Redireciona conforme o tipo de usuário
            if (user.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage(
                'Ocorreu um erro ao tentar fazer login. Tente novamente.',
            );
        }
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                <h2 className={styles.title}>Agenda Cristã</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="balamia@gmail.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Senha</label>
                        <div className={styles.passwordContainer}>
                            <input
                                type="password"
                                id="password"
                                placeholder="Digite sua senha"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className={styles.showPassword}
                            />
                        </div>
                    </div>

                    {/* Exibe a mensagem de erro, se houver */}
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}

                    <Button variant="login" type="submit">
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    );
}
