import React from 'react'

let styl = {
    width:400,
    height:600
}

class Plaintext extends React.Component{
    render() {
        return (
            <div style={styl} contentEditable="plaintext-only" onKeyUp={e =>{
                console.log(e.target.innerHTML)
            }}></div>
        )
    }
}

export default Plaintext