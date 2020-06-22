import React from 'react';
import './error-indicator.css';
import Icon from 'react-icons-kit';
import { ic_sentiment_neutral } from 'react-icons-kit/md/ic_sentiment_neutral';

const ErrorIndicator = () => {
    return (
        <div className="error">
            <Icon
                icon={ic_sentiment_neutral}
                size={160}
            />
            <span className="error__boom">
                Что-то пошло не так!
            </span>
        </div>
    )
}

export default ErrorIndicator;