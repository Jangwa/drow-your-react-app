
import React from 'react';
import logo from './logo.svg';
import { Cookies } from 'react-cookie';
import MyComponent from './MyComponent';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theTree: {"name":"ROOT","child":[{"compName":"App ","child":[{"compName":"The App Body ","child":[{"type":"__DESC","descText":" Save user id in session "},{"type":"__DESC","descText":" Save user name session "},{"compName":"MyComponent","type":"__CALL_COMP","condition":"When user hover on register"},{"compName":"RegisterComponent","type":"__CALL_COMP","condition":"When User click on register"}],"type":"__BLOCK"},{"compName":"The App Footer ","child":[{"compName":"AppFooter","type":"__CALL_COMP","condition":"for all the pages"}],"type":"__BLOCK"}],"type":"__BLOCK"},{"compName":"AppFooter ","child":[{"type":"__DESC","descText":" Do your magic "}],"type":"__BLOCK"},{"compName":"MyComponent ","child":[{"type":"__DESC","descText":" Do your magic "}],"type":"__BLOCK"},{"compName":"RegisterComponent ","child":[{"type":"__DESC","descText":" This Component Contain Registration form "},{"compName":"MyComponent","type":"__CALL_COMP","condition":""}],"type":"__BLOCK"}]},
            username: '',
            password: ''
        };
        this.currentOutLineDepth=0;
        this.compFlatArray=[];
    }
    getCompFlatArray = (firstLayer) => {
        this.compFlatArray = firstLayer.map(x => x.compName.trim());
        console.log(this.compFlatArray);
    }
    highLight = (e, comp) => {
        if(document.querySelector(`#__${comp}`)) {
            e.stopPropagation();
            const allBlock = document.querySelectorAll('.a-block, .a-line');
            for(let i=0;i<allBlock.length;i++) {
                allBlock[i].style.opacity=0.2;
            }
            e.currentTarget.style.opacity = 1;
            var nodes = [];
            var element = e.currentTarget;
            nodes.push(element);
            while(element.parentNode) {
                element.style.opacity = 1;
                nodes.unshift(element.parentNode);
                element = element.parentNode;
            }
            document.querySelector(`#__${comp}`).style.opacity = 1;
        } else {
            const allBlock = document.querySelectorAll('.a-block, .a-line');
            for(let i=0;i<allBlock.length;i++) {
                allBlock[i].style.opacity=1;
            }
        }
    }
    getEle = (da, level) => {
        const thisComp = da.child.map((x, idx) => {
            if(x.type === '__CALL_COMP') {
                this.currentOutLineDepth += 1;
            }
            return <div
                    className={x.type === '__CALL_COMP' || x.type === '__DESC' ? "a-line" : "a-block"}
                    id={`${level}__${idx}`}
                    onClick={(e) => this.highLight(e, this.compFlatArray.indexOf(x.compName))}
                >
                {   
                    x.type === '__CALL_COMP' ? 
                        <span>
                            {this.currentOutLineDepth}.
                            Call <span className="call-comp">{x.compName} </span>
                            {x.condition}
                        </span>
                    : null
                }
                {   
                    x.type === '__DESC' ? 
                        <span className="desc-line">
                            •{x.descText}
                        </span>
                    : null
                }
                {   
                    !(x.type == '__CALL_COMP' || x.type == '__DESC') ? x.compName : null
                }
                {x.child && x.child.length ? this.getEle(x, `${level}__${idx}`) : null}
                {
                    x.type === '__CALL_COMP' ?
                        <span
                            className="v-out-line"
                            style={{width: `${(100 + this.currentOutLineDepth * 20)}px`, left: '100%' }}
                            data-hight={this.compFlatArray.indexOf(x.compName)}
                            data-depth={this.currentOutLineDepth}
                        />
                        : null
                }
            </div>
        });
        return thisComp;
    }
    logIn = () => {
        const frm = window.location.search.split('?redApp=')[1];
        const { username, password } = this.state;
        fetch('http://localhost:8000/o-auth/', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ username, password })
        }
        ).then(res => res.json()).then(resp => {
            if(resp.dToken) {
                console.log(resp.dToken)
                window.location = frm + '/?dToken='+resp.dToken;
            } else {
               console.log(resp.dToken); 
            }
        });
    }
    componentDidMount(){
        const allVlines = document.querySelectorAll('.v-out-line');

        for(let i=0; i<allVlines.length;i++) {
            const hComp = allVlines[i].dataset.hight;
            if(hComp > -1) {
                console.log(hComp);
                const cTop = allVlines[i].getBoundingClientRect().y;
                const targetComp = document.querySelector(`#__${hComp}`);
                const targetCompConnector = document.querySelector(`#__${hComp}__CONNECTOR`);
                let tTop = '';
                if(targetComp) {
                    tTop = targetComp.getBoundingClientRect().y;
                }
                if(tTop - cTop > 0) {
                    allVlines[i].style.height = `${tTop - cTop + 55}px`;
                } else {
                    allVlines[i].style.height = `${-1 * (tTop - cTop + 40)}px`;
                    allVlines[i].style.transform='rotateX(180deg)';
                    allVlines[i].style.top = `${tTop - cTop + 60}px`;
                }
                if(targetCompConnector) {
                    //const currentWidth = targetCompConnector.style.width.split('px');
                    //const widthInt = currentWidth.length > 1 ? parseInt(currentWidth[0]) : 0;
                    //console.log(targetCompConnector.style.width.split('px').length, 50 + allVlines[i].dataset.depth * 20);
                    //targetCompConnector.style.width = `${Math.max(widthInt, 50 + allVlines[i].dataset.depth * 20)}px`;
                    //console.log(targetCompConnector.style.width, allVlines[i].dataset.depth);
                    targetCompConnector.style.top = '45px';
                }
            }
        }
    }
    render () {
        const { theTree } = this.state;
        this.getCompFlatArray(theTree.child);
        return (
            <div className="App">
                {this.getEle(theTree, '')}
            </div>
        );
    }
}
export default App;
