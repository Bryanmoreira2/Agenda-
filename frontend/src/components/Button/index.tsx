import { type ComponentProps } from 'react';

import clsx from 'clsx';

import styles from './styles.module.css';

type ButtonProps = ComponentProps<'button'> & {
    variant?: 'info' | 'error' | 'login' | 'success';
    active?: boolean;
};
export function Button({
    children,
    disabled,
    variant,
    active,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={clsx(
                styles.container,
                variant === 'success' && styles.success,
                variant === 'error' && styles.error,
                variant === 'login' && styles.login,
                disabled && styles.disabled,
                active && styles.active,
            )}
        >
            {children}
        </button>
    );
}
