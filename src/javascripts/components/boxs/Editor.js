import React from 'react'
import './Editor.scss'
import classname from 'classname'
import $ from 'jquery'
/*
//判断浏览器类型
function browserType(){
    var userAgent = navigator.userAgent
    return(
        userAgent.indexOf('Chrome') > -1 && 'Chrome' ||
        userAgent.indexOf('Safari') > -1 && 'Safari' ||
        userAgent.indexOf('Firefox') > -1 && 'Firefox' ||
        userAgent.indexOf('Opera') > -1 && 'Opera' ||
        userAgent.indexOf('MSIE') > -1 && 'IE'
    )
}

let UA = browserType()
*/
class Editor extends React.Component {
    static defaultProps = {
        //溢出scrollTo方法
        escape: {},
        reportText: function(seqArray){},
        reportTo: function(i,percent){}
    }

    constructor(props) {
        super(props)

        this.gates = []

        this.looseTimeout

    }

    componentDidMount() {
        this.props.escape.scrollTo = this.scrollTo.bind(this)
        this.refs.editor.onscroll = this.handleScroll.bind(this)
        
        //默认文本
        this.refs.text.innerHTML = this.props.children
        setTimeout(()=>this.handleChange(),500)

        
        //获取计算后的style
        var style = window.getComputedStyle(this.refs.text,null) 
        //获取Editor初始偏移
        this.initOffset = this.refs.text.offsetTop
        //设置影子文本的宽度
        this.refs['text-shadow'].style.width = style.width 
    }


    loose() {
        var editor = this.refs.editor
        editor.onscroll  = null
        clearTimeout(this.looseTimeout)
        this.looseTimeout = setTimeout(()=>editor.onscroll=this.handleScroll.bind(this),700)
    }


    // 滑动到第i个门限
    scrollTo(i,percent) {
        if(i>=this.gates.length) return 

        this.loose()

        var g = this.gates[i-1]
        var gp = this.gates[i]
        
        var to = g + percent*(gp - g)
        var delta = Math.abs(this.refs.editor.scrollTop - to)

        if(delta<32) this.refs.editor.scrollTop = to 

        else {
            clearTimeout(this.scrollTimeout)
            this.scrollTimeout = setTimeout(()=>$(this.refs.editor).animate({scrollTop:to},500),50)
        }
    }    

    //更新门限
    updateGates(value) {
        var sequenceTexts = value.split(/\n\n(?!\n)/)
        var len = sequenceTexts.length 
        if(sequenceTexts[len-1].length===0) sequenceTexts.pop()
        
        this.gates = [] 
        this.gates[-1] = this.initOffset
        for(var i=0;i<len;i++) {
            this.gates.push(this.testHeight(sequenceTexts[i])+this.gates[i-1])
        }
    }

    //测试文本的高度
    testHeight(text) {
        this.refs['text-shadow'].innerHTML = text + '\n\n'
        return this.refs['text-shadow'].offsetHeight
    }
    
    //汇报滑动到第i个门限 
    reportTo(scrollTop) {
        var len = this.gates.length 
        for(var i=0;i<len;i++) {
            if(this.gates[i]>=scrollTop) break
        }
        
        let percent = (scrollTop - this.gates[i-1]) / (this.gates[i] - this.gates[i-1])
        this.props.reportTo(i,percent)

    }

    //汇报转换后的md文本
    reportText(value) {
        this.props.reportText(value)
    }


    handleChange(e) {
       var plained = this.refs.text.innerHTML.replace(/<br\/?>/g,'\n') // for firefox  
        this.updateGates(plained) 
        this.reportText(plained)
    }


    handleScroll(e) {     
        this.reportTo(e.target.scrollTop)
    }

    
    render() {
        return (
            <div
            ref="editor" 
            className="element-editor" 
            >
                <div ref="text" 
                    className="text-area"
                    contentEditable="true"
                    onKeyUp={this.handleChange.bind(this)}
                >
                </div>
                <div ref="text-shadow" className="text-area-shadow"></div>
            </div>
        )
    }
}

export default Editor

