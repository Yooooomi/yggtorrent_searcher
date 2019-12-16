import React from 'react';
import s from './index.module.css';
import cl from 'classnames';
import API from '../../../../services/API';

class Torrent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: null,
        };
    }

    getContent = async ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const { content } = this.state;

        if (content) {
            return this.setState({
                content: null,
            });
        }

        const { torrent } = this.props;
        const { url } = torrent;

        try {
            const page = await API.downloadContent(url);

            this.setState({
                content: page.data,
            });
        } catch (e) {

        }
    }

    render() {
        const { torrent, className, onClick, header } = this.props;
        const { content } = this.state;

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
                    <div className={s.size}>
                    </div>
                </div>
            );
        }

        const { name, size, seed, leech, completed } = torrent;

        return (
            <div className={className}>
                <div onClick={onClick} className={cl(s.root, torrent.selected && s.selected)}>
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
                    <div className={s.infos}>
                        <button className={cl('button-inverted', 'round-button')} onClick={this.getContent}>i</button>
                    </div>
                </div>
                {
                    content && <div className={s.content} dangerouslySetInnerHTML={{ __html: content }} />
                }
            </div>
        )
    }
}

export default Torrent;