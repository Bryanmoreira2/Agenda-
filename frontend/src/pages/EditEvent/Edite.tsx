import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importa useParams para pegar o ID do evento

import { AxiosError } from 'axios';

import { ArrowLeftIcon } from '@phosphor-icons/react';

import { Button } from '../../components/Button/index';
import { api } from '../../service/api';
import styles from './styles.module.css';

type EventErrors = {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    category?: string;
    description?: string;
};

export function Edite() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [tipo, setTipo] = useState('Culto');
    const [data, setData] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [descricao, setDescricao] = useState('');
    const [location, setLocation] = useState('');
    const [errors, setErrors] = useState<EventErrors>({});

    useEffect(() => {
        if (id) {
            const loadEventData = async () => {
                try {
                    const response = await api.get(`/events/${id}`);
                    const event = response.data;

                    setTitulo(event.title || '');
                    setTipo(event.category || 'Culto');
                    setData(event.date || '');
                    setHoraInicio(event.time || '');
                    setLocation(event.location || '');
                    setDescricao(event.description || '');
                } catch (error) {
                    console.error('Erro ao carregar dados do evento:', error);
                }
            };
            loadEventData();
        }
    }, [id]);

    const handleNavigate = () => navigate('/admin');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const updatedEvent = {
            title: titulo.trim(),
            date: data,
            time: horaInicio,
            location: location.trim(),
            description: descricao.trim(),
            category: tipo,
        };

        try {
            if (id) {
                await api.put(`/events/${id}`, updatedEvent, {
                    headers: { 'Content-Type': 'application/json' },
                });
                navigate('/eventos');
            }
        } catch (error: unknown) {
            const err = error as AxiosError<{ error: string }>;

            if (err.response?.status === 400 && err.response.data?.error) {
                const dataError = err.response.data.error;
                if (dataError === 'Já existe um evento nessa data.') {
                    setErrors({ date: dataError });
                } else {
                    const [field, message] = dataError.split(':');
                    setErrors({ [field as keyof EventErrors]: message });
                }
            } else {
                console.error('Erro inesperado ao editar evento:', err.message);
            }
        }
    };

    return (
        <main className={styles.main}>
            <button onClick={handleNavigate} className={styles.backButton}>
                <ArrowLeftIcon size={25} weight="bold" />
                Voltar
            </button>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h1>Editar Evento</h1>

                <label>
                    Título do Evento
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => {
                            setTitulo(e.target.value);
                            setErrors((prev) => ({ ...prev, title: '' }));
                        }}
                    />
                    {errors.title && (
                        <span className={styles.error}>{errors.title}</span>
                    )}
                </label>

                <label>
                    Tipo de Evento
                    <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <option value="Culto">Culto</option>
                        <option value="Reunião">Reunião</option>
                        <option value="Evento Especial">Evento Especial</option>
                        <option value="Outro">Outro</option>
                        <option value="Estudo">Estudo</option>
                        <option value="Ensaio">Ensaio</option>
                    </select>
                    {errors.category && (
                        <span className={styles.error}>{errors.category}</span>
                    )}
                </label>

                <label>
                    Data
                    <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                    {errors.date && (
                        <span className={styles.error}>{errors.date}</span>
                    )}
                </label>

                <label>
                    Horário de Início
                    <input
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                    />
                    {errors.time && (
                        <span className={styles.error}>{errors.time}</span>
                    )}
                </label>

                <label>
                    Local
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors.location && (
                        <span className={styles.error}>{errors.location}</span>
                    )}
                </label>

                <label>
                    Descrição (opcional)
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    {errors.description && (
                        <span className={styles.error}>
                            {errors.description}
                        </span>
                    )}
                </label>

                <Button
                    variant="login"
                    type="submit"
                    className={styles.submitButton}
                >
                    Salvar Evento
                </Button>
            </form>
        </main>
    );
}
