/**
 * AlertCard Component
 * A reusable component for displaying alert information
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function AlertCard({ image, title, description, link }) {
    const isExternalLink = link.startsWith('http');

    const LinkComponent = isExternalLink ? (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 transition-colors"
        >
            Read More →
        </a>
    ) : (
        <Link
            to={link}
            className="text-green-600 hover:text-green-700 transition-colors"
        >
            View Details →
        </Link>
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:-translate-y-1 transition-transform duration-200">
            <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-4">
                    {description}
                </p>
                {LinkComponent}
            </div>
        </div>
    );
}

AlertCard.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default AlertCard;

// CSS styles for the alert card component
const style = document.createElement('style');
style.textContent = `
    .alert-card {
        background: var(--color-white);
        border-radius: var(--border-radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
    }

    .alert-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .alert-card-image {
        position: relative;
        overflow: hidden;
    }

    .alert-category {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        background: rgba(0, 0, 0, 0.7);
        color: var(--color-white);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 0.8em;
    }

    .alert-content {
        padding: var(--spacing-md);
    }

    .alert-title {
        margin-bottom: var(--spacing-sm);
        font-size: 1.2em;
        line-height: 1.3;
    }

    .alert-timestamp {
        display: block;
        color: var(--color-text-light);
        font-size: 0.9em;
        margin-bottom: var(--spacing-sm);
    }

    .alert-description {
        color: var(--color-text-light);
        margin-bottom: var(--spacing-md);
        line-height: 1.5;
    }

    .alert-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .read-more {
        color: var(--color-primary);
        font-weight: var(--font-weight-medium);
        text-decoration: none;
        transition: color var(--transition-fast);
    }

    .read-more:hover {
        color: var(--color-primary-dark);
    }

    .share-btn {
        background: none;
        border: none;
        padding: var(--spacing-xs);
        cursor: pointer;
        color: var(--color-text-light);
        transition: color var(--transition-fast);
    }

    .share-btn:hover {
        color: var(--color-primary);
    }

    .toast {
        position: fixed;
        bottom: var(--spacing-xl);
        left: 50%;
        transform: translateX(-50%) translateY(100%);
        background: rgba(0, 0, 0, 0.8);
        color: var(--color-white);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius-sm);
        opacity: 0;
        transition: transform var(--transition-fast), opacity var(--transition-fast);
    }

    .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    @media (max-width: 768px) {
        .alert-card {
            margin-bottom: var(--spacing-md);
        }

        .alert-title {
            font-size: 1.1em;
        }
    }
`;

document.head.appendChild(style); 