import React,{PropTypes} from 'react'

import Editor from './Editor'
import Preview from './Preview'
import demoText from './demoText'

class MarkdownEditor extends React.Component{

    constructor(props) {
        super(props)
        this.escapedFromEditor = {}
        this.escapedFromPreview = {}

        this.state = {
            text: ''
        }

        this.lock = false 
    }
    
    componentDidMount() {
        //editor
        this.editorScrollTo = this.escapedFromEditor.scrollTo 
        
        //preview
        this.previewScrollTo = this.escapedFromPreview.scrollTo 

    }

    scrollPreview() {

    }
    
    render() {
        return (
            <div style={{height:'100%'}}>
                <Editor 
                    escape={this.escapedFromEditor} 
                    reportText={text=>this.setState({text:text})}
                    reportTo={(i,percent)=>{
                        this.previewScrollTo(i,percent)
                    }}
                >
                {this.props.defaultValue}
                </Editor>
                <Preview 
                    escape={this.escapedFromPreview}
                    text={this.state.text}
                    reportTo={(i,percent)=>{
                        
                        this.editorScrollTo(i,percent)
                    }}
                />
            </div>
        )
    }
}

export default MarkdownEditor




