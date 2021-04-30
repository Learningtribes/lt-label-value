import React from "react";
import PropTypes from 'prop-types'

import "./component.scss"
import SearchIcon from './search-solid.svg'
import SyncIcon from './sync-alt-solid.svg'
import TimesIcon from './times-solid.svg'
import Dropdown from 'lt-react-dropdown'
import {get} from 'loadsh'

class Component extends React.Component {
    constructor(props, context) {
        super(props, context);

        const selectedList = (props.selectedList || []).map(p=>({...p}))
        this.state = {
            selectedList: selectedList || [], //user selected value from dropdown + user input value

            selectedItem:null,
            value:'' //the value of input box
        };

        this.myRef = React.createRef()
    }

    componentDidMount() {
        if (get(this, 'props.selectedList', []).length > 0){
            this.fireChange()
        }
    }

    append(e) {
        const selectedItem = this.getSelectedItem()
        const json = { text:selectedItem.text, key:selectedItem.value, value:e.target.value}
        const {onEnter} = this.props
        const item = this.state.selectedList.find(p=>{
            return p.key== selectedItem.value //&& p.value == e.target.value
        })
        const callback = ()=>{
            this.setState({
                value:''
            })
            onEnter && onEnter(this.state.selectedList)
            this.fireChange()
        }
        if (!item){
            this.setState(state=>{
                const selectedList = state.selectedList.concat(json)
                return {
                    selectedList
                }
            }, callback)
        }else{
            this.setState(prevState=>{
                let selectedList = prevState.selectedList.map(p=>{
                    if (p.key==json.key){
                        return json
                    }else{
                        return p
                    }
                })
                return {
                    selectedList
                }
            }, callback)
        }
    }

    removeSelected(item){
        const {onRemove} = this.props
        this.setState(state=>{
            const selectedList = state.selectedList.filter(p=>(p.text != item.text || p.value != item.value))
            return {
                selectedList
            }
        }, ()=>{
            const {selectedList} = this.state
            onRemove && onRemove(selectedList)
            this.fireChange()
        })

    }

    clean(){
        this.setState({ selectedList:[] }, this.fireChange.bind(this))
    }

    fireChange(){
        const {onChange} = this.props
        onChange && onChange(this.state.selectedList)
    }

    _handleKeyDown(e){
        if (e.key == 'Enter') {
            this.append(e)
            if (this.props.stopEventSpread){
                e.preventDefault();
                e.stopPropagation()
                return false;
            }
        }
    }

    updateValue(e){
        this.setState({
            value:e.target.value
        })
    }

    getSelectedItem(){
        const {data}=this.props
        return this.state.selectedItem || (data.length?data[0]:{})
    }

    updateSelectedItem(selectedItem) {
        this.setState({selectedItem})
    }

    render() {
        const {data,useFontAwesome,placeholder} = this.props
        const { selectedList } = this.state;
        const CleverSearchIcon = useFontAwesome ? ()=><i className="fal fa-search search-icon"/> : ()=><SearchIcon className="search-icon"/>;
        const CleverSyncIcon = useFontAwesome ? ()=><i className="fal fa-trash-alt sync-icon"/> : ()=><SyncIcon className="sync-icon"/>;
        const CleverTimesIcon = useFontAwesome ? props=><i className="fal fa-times" {...props}/> : props=><TimesIcon {...props}/>;

        return (
            <div ref={this.myRef} className={'sec-react-label-value ' + (this.props.className || '')}>
                <div className="element-wrapper">
                    <Dropdown data={data} onChange={this.updateSelectedItem.bind(this)} />
                    <div className="input-wrapper">
                        {/*<SearchIcon className="search-icon"/>*/}
                        <CleverSearchIcon/>
                        <span className="label">{this.getSelectedItem().text || ''}:</span>
                        <input className="box" type="text"
                               value={this.state.value}
                               onChange={this.updateValue.bind(this)}
                               onKeyDown={this._handleKeyDown.bind(this)}
                               placeholder={placeholder || "press enter to add"}/>

                    </div>
                    <span className="data-clear" onClick={this.clean.bind(this)}>
                        <CleverSyncIcon className="sync-icon"/>
                    </span>
                </div>
                <ul className={"selected-wrapper" + (selectedList.length <= 0 ? ' hidden' :'')}>
                    {selectedList.map(item=>(
                        <li key={`${item.text}-${item.value}`}><span>{item.text+': '+item.value}</span><CleverTimesIcon onClick={this.removeSelected.bind(this, item)}/></li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Component;

Component.propTypes = {
    data:PropTypes.arrayOf(PropTypes.exact({
        value:PropTypes.string,
        text:PropTypes.string
    })),
    placeholder:PropTypes.string,
    onEnter:PropTypes.func,
    onRemove:PropTypes.func,
    onChange:PropTypes.func,
}
