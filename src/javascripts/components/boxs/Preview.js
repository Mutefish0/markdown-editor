import React from 'react'
import MarkdownIt from 'markdown-it'
import './Preview.scss'

import $ from 'jquery'

import mdic from 'markdown-it-container'

import inline_smile from '../../markdown-extention/inline_smile'

let md = MarkdownIt()

class Preview extends React.Component {
    static defaultProps = {
        //溢出scrollTo方法 
        escape: {},
        //md源文本
        text:'',
        //汇报滑动到第i个门限
        reportTo: function(i) {}
    }

    constructor(props) {
        
        super(props);
        this.displayName = 'Preview';

        this.gateEls = []

        this.looseTimeout

    }

    componentDidMount() {
        this.props.escape.scrollTo = this.scrollTo.bind(this)
        this.refs.preview.onscroll = this.handleScroll.bind(this)
    }

    updateGateEls() {
        this.gateEls = document.querySelectorAll('.preview .seq')
        this.gateEls[-1] = {
            offsetTop:0,
            offsetHeight:0 
        }
    }


    loose() {
        var preview = this.refs.preview 
        
        preview.onscroll  = null
        clearTimeout(this.looseTimeout)
        this.looseTimeout = setTimeout(()=>preview.onscroll=this.handleScroll.bind(this),700)
    }


    //滑动到第i个门限 
    scrollTo(i,percent) {

        if(i>=this.gateEls.length) return 

        this.loose()

        var elp = document.querySelector('.preview .sequence-'+(i+1))
        var el = document.querySelector('.preview .sequence-'+i)

        var g = (el && el.offsetTop + el.offsetHeight) || 0 
        var gp = (elp && elp.offsetTop + elp.offsetHeight) || 0

        var dy =  percent * (gp  - g)
        
        var to = g + dy 
        var delta = Math.abs(to-this.refs.preview.scrollTop)

        if(delta<32) this.refs.preview.scrollTop = to 

        else {
            clearTimeout(this.scrollTimeout)
            this.scrollTimeout = setTimeout(()=>$(this.refs.preview).animate({scrollTop:to},500),50)
        }

    }


    //汇报滑动到第i个门限
    reportTo(scrollTop) {
        
        var len = this.gateEls.length 
        
        for(var i=0;i<len;i++) {  
            var g = this.gateEls[i].offsetTop + this.gateEls[i].offsetHeight
            if(g>=scrollTop) break
        }

        var gp = this.gateEls[i-1].offsetTop + this.gateEls[i-1].offsetHeight
        
        let percent = (scrollTop - gp) / (g - gp)
        
        this.props.reportTo(i,percent)
    }

    //转换md源文本为html
    processText() {
        var html = ''
        var text = this.props.text
        
        text = text.split(/\n{2,}/)

        var len = text.length 
        var seq = 0

        for(var i=0;i<len;i++) {
            if(text[i].length==0) continue
            html += md.render(text[i])
            seq++ 
            html += '<div class="seq sequence-'+seq+'"></div>'
        }
        return html
    }


    handleScroll(e) { 
        this.reportTo(e.target.scrollTop)
    }

    componentDidUpdate() {
        this.updateGateEls()
    }

    render() {
        return(
        <div 
        ref="preview" 
        className="preview"
        >
            <div ref="text" dangerouslySetInnerHTML={{__html:this.processText.bind(this)()}}></div>
            <div style={{height:'50%'}}></div>
        </div>)
    }
}

export default Preview
