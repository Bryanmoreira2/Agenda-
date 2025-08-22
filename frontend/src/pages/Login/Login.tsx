import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';

import { Aurora } from '../../components/Aurora-bg/Aurora';
import { Button } from '../../components/Button';
import { useUser } from '../../hook/use-user';
import styles from './styles.module.css';

export function Login() {
    // Estados para armazenar email, senha e erro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Hook de autenticação e navegação
    const { getUserInfo } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    // Verifica se há mensagem de sucesso do registro
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Pré-preenche o email se veio do registro
            if (location.state.email) {
                setEmail(location.state.email);
            }
        }
    }, [location.state]);

    // Validação de email
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Alterna visibilidade da senha
    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    // Envia o formulário de login
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validações básicas
        if (!email.trim() || !password.trim()) {
            setErrorMessage('Email e senha são obrigatórios');
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Por favor, insira um email válido');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const user = await getUserInfo(
                e,
                email.trim().toLowerCase(),
                password,
            );

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
        } catch (error: any) {
            console.error('Erro no login:', error);

            // Tratamento de erros específicos
            if (error.response?.status === 401) {
                setErrorMessage('Email ou senha incorretos');
            } else if (error.response?.status === 429) {
                setErrorMessage(
                    'Muitas tentativas. Tente novamente em alguns minutos.',
                );
            } else {
                setErrorMessage(
                    'Ocorreu um erro ao tentar fazer login. Tente novamente.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.loginContainer}>
            <Aurora
                colorStops={['#3A29FF', ' #050a24', '#789cff']}
                blend={1.5}
                amplitude={2.5}
                speed={0.5}
            />
            <div className={styles.loginForm}>
                <h2 className={styles.title}>Agenda Cristã</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="seu@email.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Senha</label>
                        <div className={styles.passwordContainer}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Digite sua senha"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="button"
                                className={styles.showPassword}
                                onClick={togglePasswordVisibility}
                                title={
                                    showPassword
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }
                            >
                                {showPassword ? (
                                    <EyeSlashIcon size={24} weight="bold" />
                                ) : (
                                    <EyeIcon size={24} weight="bold" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mensagem de sucesso */}
                    {successMessage && (
                        <div className={styles.successMessage}>
                            {successMessage}
                        </div>
                    )}

                    {/* Mensagem de erro */}
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}

                    <Button variant="login" type="submit" disabled={isLoading}>
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>

                {/* Links adicionais */}
                <div className={styles.loginLinks}>
                    {/* Link para registro */}
                    <div className={styles.registerLink}>
                        <p>Não tem uma conta?</p>
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className={styles.linkButton}
                        >
                            Registre-se aqui
                        </button>
                    </div>

                    {/* Link para esqueci senha (opcional) */}
                    <div className={styles.forgotPasswordLink}>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className={styles.linkButton}
                        >
                            Esqueci minha senha
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
