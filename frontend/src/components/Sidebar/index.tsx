import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importa o hook

import {
    BookmarksSimpleIcon,
    CalendarDotsIcon,
    NotePencilIcon,
    SignOutIcon,
} from '@phosphor-icons/react';

import { useUser } from '../../hook/use-user'; // Importa o hook useUser
import { Button } from '../Button/index';
import styles from './styles.module.css';

export function Sidebar() {
    const { logout, userData } = useUser(); // Desestrutura userData e logout do contexto
    const navigate = useNavigate(); // Inicializa o hook de navegação

    // Recupera o estado ativo do botão do localStorage ou define o padrão como 'agenda'
    const storedActiveButton = localStorage.getItem('activeButton') || 'agenda';
    const [activeButton, setActiveButton] = useState<
        'agenda' | 'eventos' | 'agendamento'
    >(storedActiveButton as 'agenda' | 'eventos' | 'agendamento');

    const handleClick = (route: 'agenda' | 'eventos' | 'agendamento') => {
        setActiveButton(route);
        localStorage.setItem('activeButton', route); // Armazena o estado do botão no localStorage
        if (route === 'agenda') navigate('/admin');
        if (route === 'eventos') navigate('/eventos');
        if (route === 'agendamento') navigate('/agendamento');
    };

    const handleLogout = () => {
        logout(); // Chama o logout do contexto
        localStorage.removeItem('activeButton'); // Limpa o estado ao fazer logout
        navigate('/login'); // Redireciona para a página de login
    };

    return (
        <div className={styles.sidebar}>
            <div className={styles.menu}>
                <div className={styles.logo}>Agenda Cristã</div>

                {/* Exibe os botões de "Agenda" e "Meus Eventos" apenas se o usuário for admin */}
                {userData?.isAdmin && (
                    <>
                        <Button
                            variant="success"
                            onClick={() => handleClick('agenda')}
                            active={activeButton === 'agenda'}
                        >
                            <CalendarDotsIcon fontSize={20} weight="bold" />{' '}
                            Agenda
                        </Button>

                        <Button
                            variant="success"
                            onClick={() => handleClick('eventos')}
                            active={activeButton === 'eventos'}
                        >
                            <BookmarksSimpleIcon size={20} weight="bold" />
                            Meus Eventos
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => handleClick('agendamento')}
                            active={activeButton === 'agendamento'}
                        >
                            <NotePencilIcon size={20} weight="bold" />
                            Criar Evento
                        </Button>
                    </>
                )}
            </div>

            {/* Botão de Sair */}
            <Button onClick={handleLogout} variant="error">
                <SignOutIcon weight="bold" />
                Sair
            </Button>
        </div>
    );
}
