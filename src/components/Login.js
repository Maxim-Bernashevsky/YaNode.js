import React from 'react'
import createReactClass from 'create-react-class'
import Form from './Form'
import Loader from '../ui/Loader'


export default createReactClass({
    getInitialState() {
        return {
            resultContainer: ''
        }
    },

    setResultContainer(status, reason = '') {
        this.setState({resultContainer: reason || status})
    },

    render() {
        const result = this.state.resultContainer === 'Progress' ? <Loader/> : this.state.resultContainer
        return (
            <div>
                <header>
                    <h2>Node.JS</h2>
                </header>
                <main>
                    <h1>Регистрация</h1>
                    <Form setResultContainer={this.setResultContainer}/>
                    <div id="resultContainer" className={`status-${this.state.resultContainer.toLowerCase()}`}>{result}</div>
                </main>
                <footer>
                    <a href="https://academy.yandex.ru/">Академия Яндекса</a>
                    <span className="copyright">
                        © 2017 <a title="GitHub" href="https://github.com/Maxim-Bernashevsky">Максим Бернашевский</a>
                    </span>
                </footer>
            </div>
        )
    },
})
