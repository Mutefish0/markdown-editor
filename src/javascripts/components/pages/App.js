import React from 'react'

import MarkdownEditor from '../boxs/MarkdownEditor'

import demoText from '../boxs/demoText'

const App = () => (
    <div className="app">
        <MarkdownEditor defaultValue={demoText}/>
    </div>
)

export default App