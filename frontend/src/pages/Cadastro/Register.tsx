import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Aurora } from '../../components/Aurora/Aurota';
import { Button } from '../../components/Button';
import { useUser } from '../../hook/use-user';
import styles from './styles.module.css';

export function Register() {
    // Estados para armazenar os dados do registro
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hook de autenticação e navegação
    const { registerUser } = useUser();
    const navigate = useNavigate();

    // Validação de email
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Envia o formulário de registro
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validações
        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            setErrorMessage('Todos os campos são obrigatórios');
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMessage('Por favor, insira um email válido');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('As senhas não coincidem');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await registerUser({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: password,
            });

            if (response.success) {
                // Registro bem-sucedido - redireciona para login
                navigate('/login', {
                    state: {
                        message:
                            'Conta criada com sucesso! Faça login para continuar.',
                        email: email.trim().toLowerCase(), // Pré-preenche o email no login
                    },
                });
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
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
                <h2 className={styles.title}>Registre-se</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Nome completo</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Seu nome completo"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

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
                        <input
                            type="password"
                            id="password"
                            placeholder="Mínimo 6 caracteres"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Confirmar senha</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Digite a senha novamente"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}

                    <Button variant="login" type="submit" disabled={isLoading}>
                        {isLoading ? 'Criando conta...' : 'Registrar-se'}
                    </Button>
                </form>

                <p className={styles.loginLink}>
                    Já tem uma conta?
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className={styles.linkButton}
                    >
                        Faça login
                    </button>
                </p>
            </div>
        </div>
    );
}
