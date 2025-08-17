import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PencilIcon, TrashIcon } from '@phosphor-icons/react';

import { api } from '../../service/api';
import styles from './styles.module.css';

type EventData = {
    id: string;
    titulo: string;
    data: string;
    horario: string;
    criado: string;
    local: string;
    categoria: string;
    descricao: string;
};

export function Myevents() {
    const [eventos, setEventos] = useState<EventData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
        useState(false);
    const [eventToDelete, setEventToDelete] = useState<EventData | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const eventosPorPagina = 6;
    const navigate = useNavigate();

    useEffect(() => {
        async function loadEventos() {
            try {
                const response = await api.get<EventData[]>('/myevents');
                setEventos(response.data);
            } catch (err) {
                setError('Erro ao carregar eventos');
            } finally {
                setLoading(false);
            }
        }

        loadEventos();
    }, []);

    const indexOfLastEvent = currentPage * eventosPorPagina;
    const indexOfFirstEvent = indexOfLastEvent - eventosPorPagina;
    const currentEvents = eventos.slice(indexOfFirstEvent, indexOfLastEvent);

    const handlePageChange = (newPage: number) => setCurrentPage(newPage);

    const getEventColor = (category: string) => {
        const rootStyles = getComputedStyle(document.documentElement);
        const colors: Record<string, string> = {
            Culto: '--blue',
            Reunião: '--magenta',
            Estudo: '--orange',
            Ensaio: '--teal',
            'Evento Especial': '--green',
        };
        return rootStyles.getPropertyValue(colors[category] || '--gray').trim();
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;
        try {
            await api.delete(`/events/${eventToDelete.id}`);
            setEventos(eventos.filter((e) => e.id !== eventToDelete.id));
            closeModal();
            closeDeleteConfirmationModal();
        } catch (err) {
            console.error('Erro ao deletar evento:', err);
        }
    };

    const handleEditEvent = (eventoId: string) =>
        navigate(`/editar/${eventoId}`);

    const openEventDetails = (evento: EventData) => setSelectedEvent(evento);
    const closeModal = () => setSelectedEvent(null);

    const openDeleteConfirmationModal = (evento: EventData) => {
        setIsConfirmDeleteModalOpen(true);
        setEventToDelete(evento);
    };

    const closeDeleteConfirmationModal = () => {
        setIsConfirmDeleteModalOpen(false);
        setEventToDelete(null);
    };

    if (loading) return <div>Carregando eventos...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2>Meus eventos</h2>
                    <p>Gerencie todos os seus eventos em um só lugar</p>
                </div>
            </div>

            <div className={styles.list}>
                {currentEvents.map((evento) => (
                    <div
                        key={evento.id}
                        className={styles.card}
                        style={{
                            backgroundColor: getEventColor(evento.categoria),
                        }}
                        onClick={() => openEventDetails(evento)}
                    >
                        <div className={styles.div}>
                            <h3>{evento.titulo}</h3>
                        </div>
                        <p>{`${evento.data} às ${evento.horario}`}</p>
                        <div className={styles.btn}>
                            <span className={styles.category}>
                                {evento.categoria}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginação */}
            <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>{`${currentPage}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage * eventosPorPagina >= eventos.length}
                >
                    Próxima
                </button>
            </div>

            {/* Modal para exibir detalhes do evento */}
            {selectedEvent && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.closeBtn}
                            onClick={closeModal}
                        >
                            X
                        </button>
                        <h2>{selectedEvent.titulo}</h2>
                        <p className={styles.detailsText}>Detalhes do evento</p>
                        <p>
                            <strong>Data:</strong> {selectedEvent.data}
                        </p>
                        <p>
                            <strong>Horário:</strong> {selectedEvent.horario}
                        </p>
                        <p>
                            <strong>Responsável:</strong> {selectedEvent.criado}
                        </p>
                        <p>
                            <strong>Local:</strong> {selectedEvent.local}
                        </p>
                        <p>
                            <strong>Categoria:</strong>{' '}
                            {selectedEvent.categoria}
                        </p>
                        <p>
                            <strong>Descrição:</strong>{' '}
                            {selectedEvent.descricao}
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.editBtn}
                                onClick={() =>
                                    handleEditEvent(selectedEvent.id)
                                }
                            >
                                <PencilIcon size={18} weight="bold" /> Editar
                            </button>
                            <button
                                className={styles.cancelBtn}
                                onClick={() =>
                                    openDeleteConfirmationModal(selectedEvent)
                                }
                            >
                                <TrashIcon size={18} weight="bold" /> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Deletação */}
            {isConfirmDeleteModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Tem certeza que deseja cancelar este evento?</h2>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.editBtn}
                                onClick={handleDeleteEvent}
                            >
                                Confirmar
                            </button>
                            <button
                                className={styles.cancelBtn}
                                onClick={closeDeleteConfirmationModal}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
