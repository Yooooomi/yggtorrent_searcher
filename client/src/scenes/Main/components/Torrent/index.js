import React from 'react';
import s from './index.module.css';
import cl from 'classnames';

class Torrent extends React.Component {
    render() {
        const { torrent, className, onClick, header } = this.props;

        if (header) {
            return (
                <div onClick={onClick} className={cl(s.root, className)}>
                    <div className={s.name}>
                        Torrent name
                    </div>
                    <div className={s.completed}>
                        Completed
                    </div>
                    <div className={cl(s.seed, s.seedh)}>
                        Seeders
                    </div>
                    <div className={cl(s.leech, s.leechh)}>
                        Leechers
                    </div>
                    <div className={s.size}>
                        Size
                    </div>
                </div>
            );
        }

        const { name, size, seed, leech, completed, age } = torrent;

        return (
            <div onClick={onClick} className={cl(s.root, className, torrent.selected && s.selected)}>
                <div className={s.name}>
                    {name}
                </div>
                <div className={s.completed}>
                    {completed}
                </div>
                <div className={s.seed}>
                    {seed}
                </div>
                <div className={s.leech}>
                    {leech}
                </div>
                <div className={s.size}>
                    {size}
                </div>
            </div>
        )
    }
}

export default Torrent;