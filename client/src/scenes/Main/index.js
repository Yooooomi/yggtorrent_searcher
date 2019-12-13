import React from 'react';
import s from './index.module.css';
import API from '../../services/API';
import ButtonsRadio from './components/ButtonsRadio';
import Torrent from './components/Torrent';
import mock from '../../services/mock.json';
import cl from 'classnames';

const sorts = ['seed', 'compl', 'age', 'size'];
const sortOrders = ['asc', 'desc'];

class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sort: 0,
            search: '',
            results: [],
            sortOrder: 1,
        };
    }

    search = async () => {
        const { search, sort, sortOrder } = this.state;

        const data = await API.search(search, sorts[sort], sortOrders[sortOrder]);

        this.setState({ results: data.data });
    }

    download = async () => {
        const { results } = this.state;

        console.log('Download');

        const downloaded = results.filter(e => e.selected);
        const data = await API.download(downloaded.map(e => ({
            name: e.name,
            url: e.downloadurl,
        })));
        results.forEach(e => e.selected = false);
        this.setState({ results });
    }

    update = ev => this.setState({ [ev.target.name]: ev.target.value });

    changeSort = index => this.setState({ sort: index });
    changeSortOrder = index => this.setState({ sortOrder: index });

    select = index => {
        const { results } = this.state;

        results[index].selected = !results[index].selected;
        this.setState({
            results,
        });
    }

    render() {
        const { search, sort, sortOrder, results } = this.state;

        return (
            <div className={s.root}>
                Search
                <div className={s.searchHolder}>
                    <input name="search" value={search} onChange={this.update} placeholder="Search" className={s.input} />
                </div>
                Sort
                <div className={s.optionsHolder}>
                    <div className={s.sorts}>
                        <ButtonsRadio className={s.sort} choices={sorts} selected={sort} onChange={this.changeSort} />
                        <ButtonsRadio tight choices={sortOrders} selected={sortOrder} onChange={this.changeSortOrder} />
                    </div>
                    <div className={s.buttons}>
                        {results.filter(e => e.selected).length > 0 && <button onClick={this.download} className={cl(s.button, s.download)}>Download</button>}
                        <button className={s.button} onClick={this.search}>Search</button>
                    </div>
                </div>
                <div className={s.torrentsHolder}>
                    <Torrent header className={s.torrent} />
                    {
                        results.map((e, k) => (
                            <Torrent onClick={() => this.select(k)} torrent={e} key={e.name} className={s.torrent} />
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Main;