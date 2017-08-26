import React from 'react'
import createReactClass from 'create-react-class'
import axios from 'axios'
import { mockRequest } from '../request/mockRequest'


export default createReactClass({
    getInitialState() {
        return {
            fio: '',
            email: '',
            phone: '',
            submit: '',
            urlAction: '',
        }
    },

    componentWillMount() {
        const self = this
        this.resolveResponse = {
            success: (data) => {
                self.props.setResultContainer("Success")
            },
            error: (data) => {
                self.props.setResultContainer("Error", data.reason)
            },
            progress: (data) => {
                self.props.setResultContainer("Progress")
                setTimeout(self.request, data.timeout)
            }
        }
    },

    changeInput(e){
        const input = e.target
        this.setState({ [input.id]: input.value })
        this.form[input.id].className = ''
        this.changeStateBtnSubmit()
    },

    changeStateBtnSubmit(){
        this.setState({ submit: this.checkEmptyFields().length ? '' : 'active'})
    },

    validate: function(){
        const fields = {}
        const {fio, email, phone} =  this.state

        fields.fio = fio.trim().split(' ').length === 3

        const correctSuffixEmail = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com']
        fields.email = !!correctSuffixEmail.filter( e => {
            if(email.trim().split('@')[1] === e) return true
        }).length

        fields.phone = !!phone.trim().match(/^\+7\([\d]{3}\)[\d]{3}-[\d]{2}-[\d]{2}$/) &&
            phone.split('').filter( el => { return !isNaN(el) } ).reduce((sum, current) => sum + +current, 0) < 31

        const errorFields = Object.keys(fields).filter( key => {
            if( fields[key] === false ) return key
        })

        return {
            errorFields,
            isValid: !errorFields.length
        }
    },

    checkEmptyFields: function () {
        const data = this.getData()
        return Object.keys(data).filter( key => !data[key] )
    },

    getData: function () {
        const data = {}
        this.form.childNodes.forEach( i => {
            if(i.nodeName === 'INPUT') data[i.id] = i.value
        })
        return data
    },

    setData: function (obj) {
        this.setState({
            fio: obj.fio,
            email: obj.email,
            phone: obj.phone
        })
    },

    setErrorFields: function(errorFields) {
        errorFields.forEach( name => {
            this.form[name].classList = 'error'
        })
    },

    getRandomAction(){
        const randomNum = Math.round(Math.random()*10)
        let typeAction
        if (randomNum < 4){
            typeAction = 'progress'
        } else if(randomNum > 6){
            typeAction = 'success'
        } else {
            typeAction = 'error'
        }
        return typeAction
    },

    submit: function (e) {
        e.preventDefault()
        if(!this.state.submit) return

        const validateObj = this.validate()
        if(validateObj.isValid){
            this.request()
        }
        else{
            this.setErrorFields(validateObj.errorFields)
        }
        this.setState({submit: ''})
    },

    request: function () {
        const typeAction = this.getRandomAction()
        this.setState({ urlAction: `./src/request/${typeAction}.json` }, () => {
            axios.get(this.state.urlAction)
                .then(res => {
                    const data = res.data
                    this.resolveResponse[data.status](data)
                })
                .catch(err => {
                    const data = mockRequest[typeAction]
                    this.resolveResponse[data.status](data)
                })
        })
    },

    render() {
        return (
            <form
                action={this.state.urlAction}
                onSubmit={this.submit}
                id="myForm"
                ref={ form => this.form = form }
            >
                <input
                    id="fio"
                    placeholder="ФИО"
                    type="text"
                    onChange={this.changeInput}
                />
                <input
                    id="email"
                    placeholder="Email"
                    type="text"
                    onChange={this.changeInput}
                />
                <input
                    id="phone"
                    placeholder="Телефон"
                    type="text"
                    onChange={this.changeInput}
                />
                <button
                    id="submitButton"
                    className={this.state.submit}
                    type="submit">Отправить</button>
            </form>
        )
    },
});

