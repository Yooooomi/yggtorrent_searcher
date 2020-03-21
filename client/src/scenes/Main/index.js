import React from 'react';
import s from './index.module.css';
import API from '../../services/API';
import ButtonsRadio from './components/ButtonsRadio';
import Torrent from './components/Torrent';
import mock from '../../services/mock.json';
import cl from 'classnames';

const sorts = [
    { label: 'none', value: 'none' },
    { label: 'name', value: 'name' },
    { label: 'seed', value: 'seed' },
    { label: 'leech', value: 'leech' },
    { label: 'compl', value: 'completed' },
    { label: 'age', value: 'publish_date' },
    { label: 'age', value: 'publish_date' },
    { label: 'size', value: 'size' },
];

const sortOrders = ['asc', 'desc'];

class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            sort: 0,
            search: '',
            results: process.env.REACT_APP_DEV ? mock : [],
            sortOrder: 2,
        };
    }

    search = async ev => {
        ev.preventDefault();

        const { search, sort, sortOrder } = this.state;
        let finalSort = sorts[sort].value;
        let finalSortOrder = sortOrders[sortOrder];

        if (finalSort === 'none') {
            finalSort = undefined;
            finalSortOrder = undefined;
        }

        const data = await API.search(search, finalSort, finalSortOrder);

        this.setState({ results: data.data });
    }

    download = async () => {
        const { results } = this.state;

        const downloaded = results.filter(e => e.selected);
        await API.download(downloaded.map(e => ({
            name: e.name,
            url: e.downloadurl,
            pageUrl: e.url,
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
            <form className={s.root} onSubmit={this.search}>
                Search
                <div className={s.searchHolder}>
                    <input name="search" value={search} onChange={this.update} placeholder="Search" className={s.input} />
                </div>
                Sort
                <div className={s.optionsHolder}>
                    <div className={s.sorts}>
                        <ButtonsRadio className={s.sort} choices={sorts.map(e => e.label)} selected={sort} onChange={this.changeSort} />
                        <ButtonsRadio tight choices={sortOrders} selected={sortOrder} onChange={this.changeSortOrder} />
                    </div>
                    <div className={s.buttons}>
                        {results.filter(e => e.selected).length > 0 && <button onClick={this.download} className={cl(s.button, s.download)}>Download</button>}
                        <button className={s.button} type="submit">Search</button>
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
            </form>
        )
    }
}

export default Main;