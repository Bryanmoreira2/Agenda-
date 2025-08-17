import { useState, useEffect } from 'react';

import clsx from 'clsx';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { useUser } from '../../hook/use-user'; // Importa o hook useUser
import { api } from '../../service/api';

dayjs.locale('pt-br');

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
import styles from './styles.module.css';
export function LeanderHome() {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [eventos, setEventos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { userData } = useUser(); // Acessa o userData através do hook useUser

    useEffect(() => {
        async function loadEventos() {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/events');
                console.log('API respondeu:', response.data);

                if (Array.isArray(response.data)) {
                    setEventos(response.data);
                } else {
                    console.error('Formato inesperado:', response.data);
                    setEventos([]);
                }
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar eventos');
                setEventos([]);
            } finally {
                setLoading(false);
            }
        }

        loadEventos();
    }, []);

    const startOfMonth = currentDate.startOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
    const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

    const generateCalendar = () => {
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.day}></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = dayjs(
                `${currentDate.format('YYYY-MM')}-${String(i).padStart(2, '0')}`,
            );
            const isToday = day.isSame(dayjs(), 'day');

            const eventosDoDia = eventos.filter((e) =>
                day.isSame(dayjs(e.data), 'day'),
            );

            days.push(
                <div
                    key={i}
                    className={clsx(styles.day, { [styles.today]: isToday })}
                >
                    <div className={styles.dayNumber}>{i}</div>
                    {eventosDoDia.map((e) => (
                        <div
                            key={e.id}
                            className={clsx(
                                styles.event,
                                styles[e.cor?.trim() || 'gray'],
                            )}
                        >
                            <h4>{e.title.trim()}</h4>
                            <p>{e.horario}</p>
                        </div>
                    ))}
                </div>,
            );
        }

        return days;
    };
    return (
        <div className={styles.container}>
            <div className={styles.calendar}>
                <div className={styles.calendar}>
                    <div className={styles.header}>
                        <div>
                            <h2>Olá, {userData?.name}</h2>{' '}
                            {/* Exibindo o nome do usuário */}
                            <p>
                                {dayjs().format('dddd, D [de] MMMM [de] YYYY')}
                            </p>
                        </div>

                        <div className={styles.controls}>
                            <button onClick={prevMonth}>&lt;</button>
                            <span>{currentDate.format('MMMM YYYY')}</span>
                            <button onClick={nextMonth}>&gt;</button>
                        </div>
                        <div className={styles.espaço}></div>
                    </div>

                    {loading && <p>Carregando eventos...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className={styles.weekdays}>
                        {weekDays.map((d, i) => (
                            <div
                                key={i}
                                className={clsx(styles.weekday, {
                                    [styles.activeWeekday]: i === dayjs().day(),
                                })}
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className={styles.grid}>{generateCalendar()}</div>
                </div>
            </div>
        </div>
    );
}
