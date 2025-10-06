import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    BookmarksSimpleIcon,
    CalendarDotsIcon,
    NotePencilIcon,
    SignOutIcon,
    ListIcon,
    XIcon,
} from '@phosphor-icons/react';

import { useUser } from '../../hook/use-user';
import { Button } from '../Button';
import styles from './styles.module.css';

export function Sidebar() {
    const { logout, userData } = useUser();
    const navigate = useNavigate();

    const storedActiveButton = localStorage.getItem('activeButton') || 'agenda';
    const [activeButton, setActiveButton] = useState<
        'agenda' | 'eventos' | 'agendamento'
    >(storedActiveButton as 'agenda' | 'eventos' | 'agendamento');

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (route: 'agenda' | 'eventos' | 'agendamento') => {
        setActiveButton(route);
        localStorage.setItem('activeButton', route);
        if (route === 'agenda') navigate('/admin');
        if (route === 'eventos') navigate('/eventos');
        if (route === 'agendamento') navigate('/agendamento');
        setIsOpen(false); // Fecha menu ao clicar no mobile
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem('activeButton');
        navigate('/login');
    };

    return (
        <>
            {/* Botão de menu hambúrguer (aparece no mobile) */}
            <button
                className={styles.menuToggle}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <XIcon size={28} weight="bold" />
                ) : (
                    <ListIcon size={28} weight="bold" />
                )}
            </button>

            {/* Sidebar principal */}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.menu}>
                    <div className={styles.logo}>Agenda Cristã</div>

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

                <Button onClick={handleLogout} variant="error">
                    <SignOutIcon weight="bold" />
                    Sair
                </Button>
            </div>
        </>
    );
}
