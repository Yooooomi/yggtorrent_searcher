import React from 'react';
import s from './index.module.css';
import cl from 'classnames';

class ButtonsRadio extends React.Component {
    render() {
        const { choices, selected, onChange, tight, className } = this.props;

        return (
            <span className={cl(s.root, className)}>
                {
                    choices.map((e, k, a) => {
                        let left, right, center = false;

                        if (tight) {
                            if (k === 0) left = true;
                            if (k === a.length - 1) right = true;
                            if (k !== 0 && k !== a.length - 1) center = true;
                        }

                        return (
                            <button
                                onClick={() => onChange(k)}
                                className={cl(s.button, k !== selected && 'button-inverted', left && s.left, right && s.right, center && s.center)}
                                key={e}>
                                {e}
                            </button>
                        );
                    })
                }
            </span>
        )
    }
}

export default ButtonsRadio;